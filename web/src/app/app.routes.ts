import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { BestTimesComponent } from './best-times/best-times.component';
import { MapComponent } from './map/map.component';
import { IntroduceCoordinatesComponent } from './introduce-coordinates/introduce-coordinates.component';
import { MenuComponent } from './menu/menu.component';


export const routes: Routes = [
    {
        path: 'header',
        component: HeaderComponent,
        title: 'Header'
    },
    {
        path: 'best-times',
        component: BestTimesComponent,
        title: 'Best Times',
    },
    {
        path: 'map',
        component: MapComponent,
        title: 'Map',
    },
    {
        path: 'introduce-coordinates',
        component: IntroduceCoordinatesComponent,
        title: 'Introduce Coordinates',
    },
    {
        path: '',
        component: MenuComponent,
        title: 'Traffic Lighter',
    }
];