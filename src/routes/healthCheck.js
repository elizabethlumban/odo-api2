import reportHealth from '../controllers/healthCheck';

function configureRoutes(router) {
  router.get('/', reportHealth);
}

export default configureRoutes;
