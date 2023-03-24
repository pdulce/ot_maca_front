import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from './material-module';

import { LoginResolver } from './core/resolve/login.service';
import { SessionResolver } from './core/resolve/session.service';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PromotableItemComponent } from './pages/promotable-item/promotable-item.component';
import { FunctionalGroupingComponent } from './pages/functional-grouping/functional-grouping.component';
import { TableManagerComponent } from './pages/table-manager/table-manager.component';
import { ProjectComponent } from './pages/project/project.component';
import { ReleaseDeliveryComponent } from './pages/release-delivery/release-delivery.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { ItineraryComponent } from './pages/itinerary/itinerary.component';
import { HierarchyComponent } from './pages/hierarchy/hierarchy.component';
import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { ElemenTypesComponent } from './pages/element-types/element-types.component';
import { ApplicationComponent } from './pages/application/application.component';
import { AttributesComponent } from './pages/attributes/attributes.component';
import { ValuesDomainComponent } from './pages/values-domain/values-domain.component';
import { ActivitiesQAComponent } from './pages/activities-qa/activities-qa.component';
import { StagesQAComponent } from './pages/stages-qa/stages-qa.component';

/** Listado de rutas. */
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', resolve: { loginValidationResolvedData: LoginResolver } },
  { path: 'login', component: LoginComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'home', component: HomeComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'promotable-item', component: PromotableItemComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'application', component: ApplicationComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'functional-grouping', component: FunctionalGroupingComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'project', component: ProjectComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'release-delivery', component: ReleaseDeliveryComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'deliveries', component: DeliveriesComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'itinerary', component: ItineraryComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'hierarchy', component: HierarchyComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'table-manager', component: TableManagerComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'users', component: UsersComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'roles', component: RolesComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'groups', component: GroupsComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'element-types', component: ElemenTypesComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'attributes', component: AttributesComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'stages-qa', component: StagesQAComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'activities-qa', component: ActivitiesQAComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: 'values-domain', component: ValuesDomainComponent, resolve: { sessionResolvedData: SessionResolver } },
  { path: '**', component: ErrorComponent }
];

/**
 * Componente para las rutas.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MaterialModule
  ],
  exports: [
    RouterModule,
    MaterialModule
  ],
  providers: [
    LoginResolver, 
    SessionResolver
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppRoutingModule { }