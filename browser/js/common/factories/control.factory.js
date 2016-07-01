app.factory('ControlFactory', function($http, ProjectFactory, $q){
  var projects, jobs, pages, currentProject, currentJob, currentPage;


  function setCurrentJob(jobId){
    return currentProject.jobs.filter(function(job){
      return job._id === jobId;
    })[0];
  }
  return {
    setProjects: function(_projects){
      projects = _projects;
    },
    getProjects: function(){
      return projects;
    },
    setCurrentProject: function(_currentProject){
      currentProject = _currentProject;
      return $http.post('/api/projects/setCurrent/' + _currentProject._id);
    },
    getCurrentProject: function(){
      return currentProject;
    },
    fetchAllProjects: function(){
      return $http.get('/api/projects')
      .then(function(res){
        projects = res.data;
      });
    },
    fetchCurrentProject: function(){
      console.log('fetch current project');
      return $http.get('/api/projects/getCurrent')
      .then(function(res){
        currentProject = res.data;
      });
    },
    fetchCurrentJob: function(){
      console.log('fetch current job');
      return $http.get('/api/jobs/getCurrent')
      .then(function(res){
        if (res.data && currentProject && currentProject.jobs.length)
          currentJob = setCurrentJob(res.data);
        else if (!res.data && currentProject && currentProject.jobs.length)
          currentJob = currentProject.jobs[0];
        if (currentJob)
          currentJob._frequency = currentJob.frequency.toString();
        console.log('currentJob', currentJob);
      });
    },
    setPages: function(_pages){
      pages = _pages;
    },
    getPages: function(){
      return pages;
    },
    setCurrentJob: function(_job){
      currentJob = setCurrentJob(_job._id);
      currentJob._frequency = currentJob.frequency.toString();
      return $http.post('/api/jobs/setCurrent/' + currentJob._id);
    },
    getCurrentJob: function(){
      return currentJob;
    },
    getCurrentPage: function(){
      return currentPage;
    },
    setCurrentPage: function(page){
      currentPage = page;
    },
    saveProject: function(){
      currentJob.frequency = parseInt(currentJob._frequency);
      return ProjectFactory.update(currentProject)
      .then(function(res){
        console.log(res);
        currentProject = res;
        currentJob = setCurrentJob(currentJob._id);
        currentJob._frequency = currentJob.frequency.toString();
      });
      }
  };
});
