app.factory('ControlFactory', function($http, ProjectFactory, PageFactory, $rootScope, $q, JobFactory){
  var projects, jobs, pages, currentProject, currentJobIdx, currentPageIdx;


  function setCurrentJob(jobId){
    currentJobIdx = currentProject.jobs.map(function(job){
      return job._id;
    }).indexOf(jobId);
  }

  function setCurrentProject(projectId){
    var idx = projects.map(function(pj){
      return pj._id;
    }).indexOf(projectId);
    currentProject = projects[idx];
  }

  function setCurrentPage(pageId){
    if (pageId){
      currentPageIdx = pages.map(function(page){
        return page._id;
      }).indexOf(pageId);
    }
  }

  function _init(){
    return $http.get('/api/projects') // all projects
    .then(function(res){
      projects = res.data || [];
      return $http.get('/api/projects/getCurrent'); //current project
    })
    .then(function(res){
      setCurrentProject(res.data);
      return $http.get('/api/jobs/getCurrent'); //current job
    })
    .then(function(res){
      if (res.data && currentProject && currentProject.jobs.length) //if currentJob exists
        setCurrentJob(res.data);
      else if (!res.data && currentProject && currentProject.jobs.length) //if no currentJob
        currentJobIdx = 0;
      if (currentJobIdx > -1){
        return PageFactory.fetchByJobId(currentProject.jobs[currentJobIdx]._id)
        .then(function(_pages){
          pages = _pages;
          if (pages.length){
            return $http.get('/api/pages/getCurrent')
            .then(function(res){
              setCurrentPage(res.data);
            });
          }
        });
      }
    });
  }
  return {
    init: _init,
    getProjects: function(){
      return projects;
    },
    setCurrentProject: function(currentProject){
      setCurrentProject(currentProject._id);
      return $http.post('/api/projects/setCurrent/' + currentProject._id);
    },
    getCurrentProject: function(){
      return currentProject;
    },
    setPages: function(_pages){
      pages = _pages;
    },
    getPages: function(){
      return pages;
    },
    setCurrentJob: function(job){
      setCurrentJob(job._id);
      return $http.post('/api/jobs/setCurrent/' + job._id);
    },
    getCurrentJob: function(){
      if (currentProject.jobs && currentProject.jobs.length)
        return currentProject.jobs[currentJobIdx];
      return;
    },
    getCurrentPage: function(){
      if (pages && pages.length && currentPageIdx !== undefined)
        return pages[currentPageIdx];
    },
    setCurrentPage: function(pageId){
      setCurrentPage(pageId);
      return $http.post('/api/pages/setCurrent/' + pageId);
    },
    saveProject: function(){
      return ProjectFactory.update(currentProject)
      .then(function(res){
        currentProject = res;
      });
    },
    addProject:function(projTitle){
      return ProjectFactory.create({title: projTitle})
      .then(function(project){
        projects.push(project);
        setCurrentProject(project._id);
        $rootScope.$broadcast('goToProject', project);
      });
    },
    addJob: function(jobTitle){
      if (!currentProject.jobs)
        currentProject.jobs = [];
      currentProject.jobs.push({
        title: jobTitle,
        active: false,
        pages: [],
        frequency: "1440"
      });
      return ProjectFactory.update(currentProject)
      .then(function(project){
        var newJobId = project.jobs[project.jobs.length - 1]._id;
        var job = currentProject.jobs[currentProject.jobs.length - 1];
        job.pages =  [];
        pages = [];
        job._id = newJobId;
        setCurrentJob(job._id);
        return $http.post('/api/jobs/setCurrent/' + job._id);
      });
    },
    removeJob: function(jobId){
      var idx = currentProject.jobs.map(function(job){
        return job._id;
      }).indexOf(jobId);
      currentProject.jobs.splice(idx,1);
      pages = [];
      return $q.all([ProjectFactory.update(currentProject), PageFactory.removeByJob(jobId)]) //delete associated pages from db
      .then(function(){
        if (currentProject.jobs.length){
          setCurrentJob(currentProject.jobs[currentProject.jobs.length - 1]._id);
          return $http.post('/api/jobs/setCurrent/' + job._id);
        }
      });
    },
    addPage : function(){
      return PageFactory.create({
        title: "new_page_" + Math.random().toString(10).slice(3,8),
        job: currentProject.jobs[currentJobIdx]._id,
        url: "http://www.abc.xyz"
      })
      .then(function(page){
        currentProject.jobs[currentJobIdx].pages.push(page._id);
        if (!pages)
          pages = [];
        pages.push(page);
        setCurrentPage(page._id);
        return $q.all([ProjectFactory.update(currentProject), $http.post('/api/pages/setCurrent/' + page._id)]);
      });
    },
    savePage: function(){
      var page = pages[currentPageIdx];
      if (page._actions){
        page.actions = page._actions.map(function(action){
          return JSON.stringify(action);
        });
      }
      return PageFactory.update(page);
    },
    runJob: function() {
        return JobFactory.runJob(currentProject._id, currentJobIdx);
      }

  };
});
