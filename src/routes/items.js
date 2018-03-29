import * as itemController from '../controllers/items';

function configureItemRoutes(router) {
  router.get('/', itemController.getItems);
  router.get('/:id', itemController.getItem);
}

export default configureItemRoutes;
