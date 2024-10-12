import { CanActivateFn, Router } from "@angular/router";
export const routeGuardGuard: CanActivateFn = (route) => {
  const userIsAuthorized = checkUserAuthorization(route);
  if (userIsAuthorized) {
    return true;
  } else {
    false;
  }
  return false;
};

function checkUserAuthorization(route){

  const routePath = route.routeConfig?.path
  if(routePath == 'veterinar' && localStorage.getItem("clinicId") != null){
    return true;
  }
  else if(routePath == 'stranka' && localStorage.getItem("clinicId") == null){
      return true;
    }
    else return false;
}
