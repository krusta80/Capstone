app.factory('ControlFactory', function($http, ProjectFactory, PageFactory, $rootScope, $q, JobFactory){
  var projects, pages, currentProject, currentJobIdx, currentPageIdx;


  function setCurrentJob(jobId){
    currentJobIdx = currentProject.jobs.map(function(job){
      return job._id;
    }).indexOf(jobId);
  }

  function setCurrentProject(projectId){
    var idx = projects.map(function(pj){
      return pj._id;
    }).indexOf(projectId);
    if (idx > -1)
      currentProject = projects[idx];
  }

  function setCurrentPage(pageId){
    if (pageId){
      currentPageIdx = pages.map(function(page){
        return page._id;
      }).indexOf(pageId);
    }
  }

  function parseActions(){
    var page = pages[currentPageIdx];
    if (page && !page._actions && page.actions && page.actions.length){
      page._actions = page.actions.map(function(action){
        return JSON.parse(action);
      });
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
              parseActions();
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
      currentPageIdx = pages = undefined;
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
      if (currentProject && currentProject.jobs && currentProject.jobs.length)
        return currentProject.jobs[currentJobIdx];
      return;
    },
    getCurrentPage: function(){
      if (pages && pages.length && currentPageIdx !== undefined)
        return pages[currentPageIdx];
    },
    setCurrentPage: function(pageId){
      setCurrentPage(pageId);
      parseActions();
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
        pages = currentPageIdx = undefined;
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
          var newJobId = currentProject.jobs[currentProject.jobs.length - 1]._id;
          setCurrentJob(newJobId);
          return $http.post('/api/jobs/setCurrent/' + newJobId);
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
    removePage: function(){
      var page = pages[currentPageIdx];
      var pageId = page._id;
      return PageFactory.remove(page._id) //remove pg from db
      .then(function(){
        pages.splice(currentPageIdx, 1); //remove pg from client
        var job = currentProject.jobs[currentJobIdx];
        job.pages.splice(job.pages.indexOf(pageId),1); //remove pg from job
        return ProjectFactory.update(currentProject); // update job in db
      })
      .then(function(){
        if (currentPageIdx){
          currentPageIdx--;
          parseActions();
          var pageId = pages[currentPageIdx]._id;
          return $http.post('/api/pages/setCurrent/' + pageId);
        }
      });
    },
    removeProject: function(){
      var pRemovePages = $q.all(currentProject.jobs.map(function(job){
        return PageFactory.removeByJob(job._id);
      }));
      return $q.all([pRemovePages, ProjectFactory.remove(currentProject._id)])
      .then(function(){
        projects.splice(projects.indexOf(currentProject),1);
        if (projects.length){
          var project = projects[projects.length - 1];
          setCurrentProject(project._id);
          $rootScope.$broadcast('goToProject', project);
          return $http.post('/api/projects/setCurrent/' + project._id);
        }
        else {
          currentProject = currentPageIdx = pages = currentJobIdx = undefined;
        }
      });
    },
    runJob: function() {
        return JobFactory.runJob(currentProject._id, currentJobIdx)
        .then(function(){
          return JobFactory.fetchByProjectId(currentProject._id);
        })
        .then(function(jobs){
          var job = currentProject.jobs[currentJobIdx];
          var updated = jobs[currentJobIdx];
          job.runHistory = updated.runHistory;
          job.lastRun = updated.lastRun;
        });
      }

  };
});
