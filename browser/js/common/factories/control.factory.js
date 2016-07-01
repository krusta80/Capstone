app.factory('ControlFactory', function($http, ProjectFactory, $q){
  var projects, jobs, pages, currentProject, currentJobIdx, currentPage;


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

  function _init(){
    return $http.get('/api/projects') // all projects
    .then(function(res){
      projects = res.data;
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
      if (currentProject.jobs.length)
        return currentProject.jobs[currentJobIdx];
      return;
    },
    getCurrentPage: function(){
      return currentPage;
    },
    setCurrentPage: function(page){
      currentPage = page;
    },
    saveProject: function(){
      return ProjectFactory.update(currentProject)
      .then(function(res){
        currentProject = res;
      });
      }
  };
});
