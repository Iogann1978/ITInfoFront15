// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiGoogleEndpoint: './assets/book-google.json',
  apiBookEndpointId: './assets/book-:id.json',
  apiBookEndpoint: './assets/books.json',
  apiAuthorEndpointId: './assets/author-:id.json',
  apiAuthorEndpoint: './assets/authors.json',
  apiCourseEndpointId: './assets/course-:id.json',
  apiCourseEndpoint: './assets/courses.json',
  apiPublisherEndpointId: './assets/publisher-:id.json',
  apiPublisherEndpoint: './assets/publishers.json',
  apiTagEndpointId: './assets/tag-:tag.json',
  apiTagEndpoint: './assets/tags.json',
  apiFileEndpointId: './assets/file-:id.json',
  apiFileEndpoint: './assets/files.json',
  apiDescriptEndpointId: './assets/descript-:id.json',
  apiDescriptEndpoint: './assets/descripts.json',
  apiInfoEndpointId: './assets/info-:id.json',
  apiInfoEndpoint: './assets/info.json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
