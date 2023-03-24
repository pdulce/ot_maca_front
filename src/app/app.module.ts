import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeES, 'es');

// Reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Date time picker
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

// Web animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { ServicesModule } from './core/core.module';
import { ErrorComponent } from './pages/error/error.component';
import { PromotableItemComponent, PromotableItemAddnewDialog, PromotableItemAddnewAditionalDialog, PromotableItemEditDialog } from './pages/promotable-item/promotable-item.component';
import { FunctionalGroupingComponent, FunctionalGroupingAddnewDialog, FunctionalGroupingEditDialog, FunctionalGroupingAddnewAditionalDialog } from './pages/functional-grouping/functional-grouping.component';
import { ProjectComponent, ProjectAddnewAditionalDialog, ProjectAddnewDialog, ProjectEditDialog } from './pages/project/project.component';
import { ReleaseDeliveryComponent, ReleaseDeliveryAddnewDialog, ReleaseDeliveryEditDialog } from './pages/release-delivery/release-delivery.component';
import { ItineraryComponent, ItineraryAddnewDialog, ItineraryEditDialog } from './pages/itinerary/itinerary.component';
import { HierarchyComponent } from './pages/hierarchy/hierarchy.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { GroupsComponent, GroupsAddnewDialog, GroupsEditDialog } from './pages/groups/groups.component';
import { RolesComponent, RolesAddnewDialog, RolesEditDialog } from './pages/roles/roles.component';
import { UsersComponent, UsersAddnewDialog, UsersEditDialog } from './pages/users/users.component';
import { ApplicationComponent, ApplicationAddnewDialog, ApplicationAddnewAditionalDialog, ApplicationEditDialog } from './pages/application/application.component';
import { ElemenTypesComponent, ElemenTypesAddnewDialog, ElemenTypesEditDialog } from './pages/element-types/element-types.component';
import { AttributesAddnewDialog, AttributesComponent, AttributesEditDialog } from './pages/attributes/attributes.component';
import { ActivitiesQAAddnewDialog, ActivitiesQAComponent, ActivitiesQAEditDialog, PesosQAEditDialog, UmbralesQAEditDialog } from './pages/activities-qa/activities-qa.component';
import { StagesQAAddnewDialog, StagesQAComponent, StagesQAEditDialog } from './pages/stages-qa/stages-qa.component';
import { ValuesDomainAddnewDialog, ValuesDomainComponent, ValuesDomainEditDialog } from './pages/values-domain/values-domain.component';

// Modulos iniciales usados
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		ErrorComponent,
		LoginComponent,
   		HomeComponent,
		PromotableItemComponent,
		PromotableItemAddnewDialog,
		PromotableItemAddnewAditionalDialog,
		PromotableItemEditDialog,
		FunctionalGroupingComponent,
		FunctionalGroupingAddnewDialog,
		FunctionalGroupingAddnewAditionalDialog,
		FunctionalGroupingEditDialog,
		ApplicationComponent,
		ApplicationAddnewDialog,
		ApplicationAddnewAditionalDialog,
		ApplicationEditDialog,
		ProjectComponent,
		ProjectAddnewAditionalDialog,
		ProjectAddnewDialog,
		ProjectEditDialog,
		ReleaseDeliveryComponent,
		ReleaseDeliveryAddnewDialog,
		ReleaseDeliveryEditDialog,
		ItineraryComponent,		
		ItineraryAddnewDialog,
		ItineraryEditDialog,
		HierarchyComponent,
		AttributesComponent,
		AttributesAddnewDialog,
		AttributesEditDialog,
		DeliveriesComponent,
		UsersComponent,
		UsersAddnewDialog,
		UsersEditDialog,
		RolesComponent,
		RolesAddnewDialog,
		RolesEditDialog,
		GroupsComponent,
		GroupsAddnewDialog,
		GroupsEditDialog,
		ElemenTypesComponent, 
		ElemenTypesAddnewDialog, 
		ElemenTypesEditDialog,
		ValuesDomainComponent, 
		ValuesDomainAddnewDialog, 
		ValuesDomainEditDialog,
		ActivitiesQAComponent, 
		ActivitiesQAAddnewDialog, 
		ActivitiesQAEditDialog,
		PesosQAEditDialog,
		UmbralesQAEditDialog,
		StagesQAComponent, 
		StagesQAAddnewDialog, 
		StagesQAEditDialog		
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'mad' }),
		BrowserTransferStateModule,
		HttpClientModule,
		AppRoutingModule,
		// Forms
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		//Date time picker
		NgxMatDatetimePickerModule,
		NgxMatTimepickerModule,
		NgxMatNativeDateModule,
		NgxMatMomentModule,
		// Material
		MaterialModule,
		// Core
		ServicesModule
	],
	exports: [
		MaterialModule
	],
	providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'es' }
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }