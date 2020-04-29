import {InjectionToken} from '@angular/core';

export let ENDPOINTS_CONFIG = new InjectionToken('endpoints.config');

export const EndpointsConfig: any = {
  heroes: {
    list: 'users',
    detail: getHeroDetail
  }
};

export function getHeroDetail(id) {
  return `/users/${id}`;
}

export const EndpointsCategory: any = {
  categories: {
    list: 'categories',
    detail: getCategoryDetail
  }
};

export function getCategoryDetail(id) {
  return `/categories/${id}`;
}

export const EndpointsProduct: any = {
  products: {
    list: 'products',
    detail: getProductDetail
  }
};

export function getProductDetail(id) {
  return `/products/${id}`;
}
