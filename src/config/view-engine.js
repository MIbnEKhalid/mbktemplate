import mbkroutes from 'mbkauthe';
import { setupViewEngine as setupEngine } from 'mbkutils';

export function setupViewEngine(app) {
    setupEngine([app, mbkroutes]);
}

export default setupViewEngine;
