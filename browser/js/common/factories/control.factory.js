app.factory('ControlFactory', function($http){
  var projects, jobs, pages, currentProject, currentJob, currentPage;


  return {
    setProjects: function(_projects){
      projects = _projects;
    },
    getProjects: function(){
      return projects;
    },
    setCurrentProject: function(_currentProject){
      currentProject = _currentProject;
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
    setCurrentJob: function(_job){
      currentJob = _job;
    },
    getCurrentJob: function(){
      return currentJob;
    },
    getCurrentPage: function(){
      return currentPage;
    },
    setCurrentPage: function(page){
      currentPage = page;
    }
  };
});
