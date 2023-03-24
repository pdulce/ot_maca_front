import { NgModule } from '@angular/core';

import { HeadersService } from './headers/headers.service';
import { CommonService } from './services/common.service';
import { UsersService } from './services/users.services';
import { AttributesService } from './services/attributes.services';
import { ActivitiesQAService } from './services/activities-qa.services';
import { CatalogService } from './services/catalog.service';
import { ItineraryService } from './services/itinerary.service';
import { HierarchyService } from './services/hierarchy.service';

/**
 * Clase con los módulos usados.
 */
@NgModule({
    providers: [
        HeadersService,
        CommonService,
        UsersService,
        AttributesService,
        ActivitiesQAService,
        CatalogService,
        ItineraryService,
        HierarchyService
	]
})
export class ServicesModule {}