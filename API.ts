/* tslint:disable */
/* eslint:disable */
import 'isomorphic-fetch';

export type ThenArg<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any[]) => Promise<infer U>
  ? U
  : T;

type QueryParameters = {
  [key: string]:
    | string
    | number
    | string[]
    | number[]
    | boolean
    | boolean[]
    | undefined;
};

export type LangEnum = 'sk' | 'cz' | 'en';
export type ViewTypeEnum = 'admin' | 'public';
export type Error = {
  description?: string;

  name?: string;

  payload?: {};

  statusCode?: number;

  userinfo?: string;
};

class ApiError {
  public message: string;
  public details: Error | null = null;

  constructor(message: string) {
    this.message = message;
  }
}

/**
 *
 * @class API
 * @param {(string)} [domainOrOptions] - The project domain.
 */
class API {
  protected baseUrl: string = '';
  protected headers: { name: string; value: string }[] = [];
  protected token: string = '';

  serializeQueryParams(parameters: QueryParameters) {
    return Object.keys(parameters)
      .reduce((acc: string[], p) => {
        const param = parameters[p];
        if (typeof param === 'undefined' || param === '') {
          return acc;
        }
        return [
          ...acc,
          `${encodeURIComponent(p)}=${encodeURIComponent(
            String(parameters[p]),
          )}`,
        ];
      }, [])
      .join('&');
  }

  protected transformParameter(value: any, transformOperation?: string) {
    switch (transformOperation) {
      case 'joinUsingPipes':
        return Array.isArray(value) ? value.join('|') : value;
      default:
        return value;
    }
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public setHeaders(headers: { name: string; value: string }[]) {
    this.headers = headers;
  }

  public setToken(token: string) {
    this.token = token;
  }

  protected appendAuthHeaders(headerParams: Headers) {
    const headers = new Headers(headerParams);
    if (this.token) {
      headers.append('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  private async request(
    method: string,
    url: string,
    body: any,
    headers: Headers = new Headers(),
    queryParameters: QueryParameters = {},
  ) {
    const queryParams =
      queryParameters && Object.keys(queryParameters).length
        ? this.serializeQueryParams(queryParameters)
        : null;
    const urlWithParams = url + (queryParams ? '?' + queryParams : '');

    if (headers.get('Content-Type') === 'multipart/form-data') {
      const form = new FormData();
      for (let k in body) {
        form.append(k, body[k]);
      }
      body = form;
    } else if (
      headers.get('Content-Type') === 'application/json' &&
      body &&
      Object.keys(body).length > 0
    ) {
      body = JSON.stringify(body);
    } else {
      body = undefined;
    }

    if (headers.get('Content-Type') === 'multipart/form-data') {
      headers.delete('Content-Type');
    }

    if (this.headers.length > 0) {
      this.headers.forEach((h) => {
        headers.append(h.name, h.value);
      });
    }

    const response = await fetch(urlWithParams, { method, headers, body });

    if (response.status === 204) return response;

    if (response.ok) {
      const responseContentType =
        (response.headers && response.headers.get('Content-Type')) || '';
      if (responseContentType.includes('application/json')) {
        return response.json();
      }
      return response;
    } else {
      const err = new ApiError(response.statusText);
      err.details = await response.json();
      throw err;
    }
  }

  /**
   * Search pickup points
   * @method
   * @name API#searchPickupPoints
   */
  searchPickupPoints(
    parameters: {
      limit?: number;
      offset?: number;
      query?: string;
      activeDeliveries?: string;
    } = {},
  ): Promise<void> {
    let path = '/pickup-points';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    if (typeof parameters['activeDeliveries'] !== 'undefined') {
      queryParameters['active_deliveries'] = parameters['activeDeliveries'];
    }

    queryParameters['active_deliveries'] = this.transformParameter(
      queryParameters['active_deliveries'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns basic info about articles
   * @method
   * @name API#loadArticles
   */
  loadArticles(
    parameters: {
      limit?: number;
      offset?: number;
      sitemapId?: number;
      isPublished?: '0' | '1';
      tagId?: number;
      tagExcludeId?: number;
      sitemapUniqueId?: string;
      isTop?: '0' | '1';
      identificator?: string;
      sfForm?: string;
      query?: string;
      brandName?: string;
      onlyActual?: '0' | '1';
      sort?: 'date' | 'sorting' | 'created_date';
      sortDir?: 'asc' | 'desc';
      excludeBody?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    articles?: Array<{}>;

    total?: number;
  }> {
    let path = '/articles';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['sitemapId'] !== 'undefined') {
      queryParameters['sitemap_id'] = parameters['sitemapId'];
    }

    queryParameters['sitemap_id'] = this.transformParameter(
      queryParameters['sitemap_id'],
    );

    if (typeof parameters['isPublished'] !== 'undefined') {
      queryParameters['is_published'] = parameters['isPublished'];
    }

    queryParameters['is_published'] = this.transformParameter(
      queryParameters['is_published'],
    );

    if (typeof parameters['tagId'] !== 'undefined') {
      queryParameters['tag_id'] = parameters['tagId'];
    }

    queryParameters['tag_id'] = this.transformParameter(
      queryParameters['tag_id'],
    );

    if (typeof parameters['tagExcludeId'] !== 'undefined') {
      queryParameters['tag_exclude_id'] = parameters['tagExcludeId'];
    }

    queryParameters['tag_exclude_id'] = this.transformParameter(
      queryParameters['tag_exclude_id'],
    );

    if (typeof parameters['sitemapUniqueId'] !== 'undefined') {
      queryParameters['sitemap_unique_id'] = parameters['sitemapUniqueId'];
    }

    queryParameters['sitemap_unique_id'] = this.transformParameter(
      queryParameters['sitemap_unique_id'],
    );

    if (typeof parameters['isTop'] !== 'undefined') {
      queryParameters['is_top'] = parameters['isTop'];
    }

    queryParameters['is_top'] = this.transformParameter(
      queryParameters['is_top'],
    );

    if (typeof parameters['identificator'] !== 'undefined') {
      queryParameters['identificator'] = parameters['identificator'];
    }

    queryParameters['identificator'] = this.transformParameter(
      queryParameters['identificator'],
    );

    if (typeof parameters['sfForm'] !== 'undefined') {
      queryParameters['sf_form'] = parameters['sfForm'];
    }

    queryParameters['sf_form'] = this.transformParameter(
      queryParameters['sf_form'],
    );

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    if (typeof parameters['brandName'] !== 'undefined') {
      queryParameters['brand_name'] = parameters['brandName'];
    }

    queryParameters['brand_name'] = this.transformParameter(
      queryParameters['brand_name'],
    );

    if (typeof parameters['onlyActual'] !== 'undefined') {
      queryParameters['only_actual'] = parameters['onlyActual'];
    }

    queryParameters['only_actual'] = this.transformParameter(
      queryParameters['only_actual'],
    );

    queryParameters['sort'] = 'date';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'desc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    if (typeof parameters['excludeBody'] !== 'undefined') {
      queryParameters['exclude_body'] = parameters['excludeBody'];
    }

    queryParameters['exclude_body'] = this.transformParameter(
      queryParameters['exclude_body'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with all info about article
   * @method
   * @name API#loadArticleDetail
   */
  loadArticleDetail(
    articleId: number,
    parameters: {
      withNextArticle?: '0' | '1';
      withHiddenTags?: '0' | '1';
      withLangVersions?: '0' | '1';
      productCategoryId?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/articles/{article_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{article_id}', articleId.toString());

    if (typeof parameters['withNextArticle'] !== 'undefined') {
      queryParameters['with_next_article'] = parameters['withNextArticle'];
    }

    queryParameters['with_next_article'] = this.transformParameter(
      queryParameters['with_next_article'],
    );

    if (typeof parameters['withHiddenTags'] !== 'undefined') {
      queryParameters['with_hidden_tags'] = parameters['withHiddenTags'];
    }

    queryParameters['with_hidden_tags'] = this.transformParameter(
      queryParameters['with_hidden_tags'],
    );

    if (typeof parameters['withLangVersions'] !== 'undefined') {
      queryParameters['with_lang_versions'] = parameters['withLangVersions'];
    }

    queryParameters['with_lang_versions'] = this.transformParameter(
      queryParameters['with_lang_versions'],
    );

    if (typeof parameters['productCategoryId'] !== 'undefined') {
      queryParameters['product_category_id'] = parameters['productCategoryId'];
    }

    queryParameters['product_category_id'] = this.transformParameter(
      queryParameters['product_category_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with all info about article
   * @method
   * @name API#loadArticlePreview
   */
  loadArticlePreview(
    articleId: number,
    parameters: {
      withNextArticle?: '0' | '1';
      withHiddenTags?: '0' | '1';
      withLangVersions?: '0' | '1';
      productCategoryId?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{}> {
    let path = '/preview/{article_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{article_id}', articleId.toString());

    if (typeof parameters['withNextArticle'] !== 'undefined') {
      queryParameters['with_next_article'] = parameters['withNextArticle'];
    }

    queryParameters['with_next_article'] = this.transformParameter(
      queryParameters['with_next_article'],
    );

    if (typeof parameters['withHiddenTags'] !== 'undefined') {
      queryParameters['with_hidden_tags'] = parameters['withHiddenTags'];
    }

    queryParameters['with_hidden_tags'] = this.transformParameter(
      queryParameters['with_hidden_tags'],
    );

    if (typeof parameters['withLangVersions'] !== 'undefined') {
      queryParameters['with_lang_versions'] = parameters['withLangVersions'];
    }

    queryParameters['with_lang_versions'] = this.transformParameter(
      queryParameters['with_lang_versions'],
    );

    if (typeof parameters['productCategoryId'] !== 'undefined') {
      queryParameters['product_category_id'] = parameters['productCategoryId'];
    }

    queryParameters['product_category_id'] = this.transformParameter(
      queryParameters['product_category_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns basic info about authors
   * @method
   * @name API#loadAuthors
   */
  loadAuthors(
    parameters: {
      limit?: number;
      offset?: number;
      query?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    articles?: Array<{
      author_id?: number;

      image?: string;

      name?: string;

      url?: string;
    }>;
  }> {
    let path = '/authors';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with all info about author
   * @method
   * @name API#loadAuthorDetail
   */
  loadAuthorDetail(
    authorId: number,
    parameters: {
      limit?: number;
      offset?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    admin_id?: number;

    articles?: Array<{}>;

    author_id?: number;

    created_at?: string;

    email?: string;

    image?: {};

    json_content?: {};

    name?: string;

    phone?: string;

    total_articles?: number;

    url?: string;

    xml_content?: {};
  }> {
    let path = '/authors/{author_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{author_id}', authorId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns connected products
   * @method
   * @name API#loadWebContentProductsConnections
   */
  loadWebContentProductsConnections(
    webContentId: number,
    parameters: {
      limit?: number;
      offset?: number;
      onstock?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    products: Array<{
      name?: string;

      picture?: string;

      product_id?: number;

      type_id?: number;

      url?: string;
    }>;
  }> {
    let path = '/web_content/product_connections/{web_content_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{web_content_id}', webContentId.toString());

    if (typeof parameters['onstock'] !== 'undefined') {
      queryParameters['onstock'] = parameters['onstock'];
    }

    queryParameters['onstock'] = this.transformParameter(
      queryParameters['onstock'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns content connections
   * @method
   * @name API#loadContentConnections
   */
  loadContentConnections(
    webContentId: number,
    parameters: {
      limit?: number;
      offset?: number;
      connectionType?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    total: number;

    web_content_connections: Array<{
      author?: default_1;

      id?: number;

      image?: string;

      is_top?: boolean;

      name?: string;

      tags?: Array<{}>;

      url?: string;
    }>;
  }> {
    let path = '/web_content/connections/{web_content_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{web_content_id}', webContentId.toString());

    if (typeof parameters['connectionType'] !== 'undefined') {
      queryParameters['connection_type'] = parameters['connectionType'];
    }

    queryParameters['connection_type'] = this.transformParameter(
      queryParameters['connection_type'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns content banners
   * @method
   * @name API#loadContentBanners
   */
  loadContentBanners(contentId: number, parameters: {} = {}): Promise<{}> {
    let path = '/web_content/{content_id}/banners';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{content_id}', contentId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns content banners
   * @method
   * @name API#loadBannerPositions
   */
  loadBannerPositions(parameters: {} = {}): Promise<{}> {
    let path = '/web_content/banners/positions';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * You can specify category ID to get availabilities only for products in
specific category

    * @method
    * @name API#loadAvailabilities
    */
  loadAvailabilities(
    parameters: {
      categoryId?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    availabilities?: Array<availability>;
  }> {
    let path = '/availabilities';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with all info about article
   * @method
   * @name API#loadBanners
   */
  loadBanners(
    parameters: {
      sitemapId?: string;
      position?: string;
      limit?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    banners: Array<{
      id: number;

      sitemap_id: number | null;

      b_position: string;

      b_name: string;

      b_description: string;

      b_type: string;

      b_path: string;

      b_url: string | null;

      b_sort: number | null;

      created: string;

      lang: string;

      device: string;

      isActive?: boolean;

      isActiveSince?: string;

      isActiveUntil?: string;

      b_buttontext?: string;
    }>;
  }> {
    let path = '/banners';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['sitemapId'] !== 'undefined') {
      queryParameters['sitemap_id'] = parameters['sitemapId'];
    }

    queryParameters['sitemap_id'] = this.transformParameter(
      queryParameters['sitemap_id'],
    );

    if (typeof parameters['position'] !== 'undefined') {
      queryParameters['position'] = parameters['position'];
    }

    queryParameters['position'] = this.transformParameter(
      queryParameters['position'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns cart delivery countries
   * @method
   * @name API#loadDeliveryCountries
   */
  loadDeliveryCountries(
    parameters: {
      viewType?: 'admin' | 'public';
      id?: string;
      lang?: string;
      withTranslations?: '1' | '0';
      sort?: 'name';
      sortDir?: 'asc' | 'desc';
      withAdditionalInputs?: '1' | '0';
      onlyWithOrders?: '1' | '0';
    } = {},
  ): Promise<
    Array<{
      id: string | null;

      name: string;

      phone_prefix: string;

      additional_info: object | null;

      translations?: Array<{}>;
    }>
  > {
    let path = '/eshop/delivery-countries';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['viewType'] !== 'undefined') {
      queryParameters['view_type'] = parameters['viewType'];
    }

    queryParameters['view_type'] = this.transformParameter(
      queryParameters['view_type'],
    );

    if (typeof parameters['id'] !== 'undefined') {
      queryParameters['id'] = parameters['id'];
    }

    queryParameters['id'] = this.transformParameter(queryParameters['id']);

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['withTranslations'] !== 'undefined') {
      queryParameters['with_translations'] = parameters['withTranslations'];
    }

    queryParameters['with_translations'] = this.transformParameter(
      queryParameters['with_translations'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    if (typeof parameters['withAdditionalInputs'] !== 'undefined') {
      queryParameters['with_additional_inputs'] =
        parameters['withAdditionalInputs'];
    }

    queryParameters['with_additional_inputs'] = this.transformParameter(
      queryParameters['with_additional_inputs'],
    );

    if (typeof parameters['onlyWithOrders'] !== 'undefined') {
      queryParameters['only_with_orders'] = parameters['onlyWithOrders'];
    }

    queryParameters['only_with_orders'] = this.transformParameter(
      queryParameters['only_with_orders'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load delivery countries for cart
   * @method
   * @name API#loadCartDeliveryCountries
   */
  loadCartDeliveryCountries(
    cartId: string,
    parameters: {} = {},
  ): Promise<object> {
    let path = '/cart/{cart_id}/delivery-countries';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Info about general free delivery price
   * @method
   * @name API#getGeneralFreeDeliveryInfo
   */
  getGeneralFreeDeliveryInfo(
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    price?: number;

    currency?: string;
  }> {
    let path = '/cart/free-delivery';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns new empty cart
   * @method
   * @name API#createCart
   */
  createCart(
    parameters: {
      domainId?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    id: string;
  }> {
    let path = '/cart';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns products, total count and price and other information about cart
   * @method
   * @name API#getCart
   */
  getCart(
    cartId: string,
    parameters: {
      vatGroups?: 0 | 1;
    } = {},
  ): Promise<{
    id: string;

    total_items_count: number;

    total_items_price: number;

    total_items_price_without_vat: number;

    total_giftcards_price: number;

    total_price: number;

    total_price_without_vat?: number;

    price_rounding_value?: number;

    currency: string;

    discount: number;

    discount_save: number;

    discount_reg: number;

    assigned_points: number;

    consumed_points: number;

    items: Array<{
      count: number;

      unpacking_cost?: number;

      good: object;

      product: {
        id: number;

        ean: string | null;

        name: string;

        plu: string | null;

        url: string;

        picture: string | null;

        name_url_encoded: string;

        productPackages?: Array<{
          id?: number;

          productId?: number;

          storeQuantity?: number;

          fullQuantity?: number;

          type?: number;
        }>;
      };

      idx: number;

      sum_price?: number;

      sum_price_without_vat?: number;

      sum_points: number;

      store: {
        store_id?: number;

        store_name?: string;

        store_phone?: string;

        store_email?: string;

        store_infourl?: string;

        store_priority?: number;

        store_minqty?: number;

        store_type?: 'STORE' | 'SHOP';
      };

      availability: availability;

      product_note?: string | null;

      sum_discount_applied?: number;
    }>;

    giftcards: Array<{
      id: number;

      order_id: number;

      card_number: string;

      date_validity: string;

      price: number;

      price_currency: string;

      price_validity: number;

      valid_products_count: number;

      discount: number;

      discount_currency: string;

      is_strict_discount: 0 | 1;

      card_status: string;

      date_used: string;

      club_user_id: number;

      created_date: string;

      created_user_id: number;

      multicard: 0 | 1;

      sale: number;

      sale_count: number;

      apply_per_unit: 0 | 1;

      lang: string;

      valid_product_ids?: Array<number>;

      count_use?: number;

      sale_price?: number;

      sale_price_without_vat?: number;
    }>;

    pointcards: Array<{
      id: number;

      name: string;

      points: number;

      discount: number;

      count: number;
    }>;

    sales: Array<{
      id: number | null;

      name: string;

      type: 'PRODUCTS' | 'CART';

      buy_count: number;

      buy_price: number;

      buy_price_currency: number;

      sale_count: number;

      sale_discount: number;

      sale_unitprice: number;

      sale_currency: string;

      sale_name: string;

      sale_choose_only: boolean;

      priority: number;

      valid_from: string | null;

      valid_to: string | null;

      members_only: boolean;

      combine_possible: boolean;

      is_strict_discount: boolean;

      transport_price: number;

      gift: string | null;

      lang: string;

      products: Array<{
        id_product?: number;

        id_sale?: number;

        buy?: boolean;

        sale?: boolean;

        name?: string;
      }>;
    }>;

    delivery: items;

    payment?: {
      payment_id: string;

      payment_name: string;

      payment_descr: string;

      payment_priority: number;

      payment_sort: number | null;

      helios_id?: string | null;

      ans_product_code?: string | null;

      outer_id?: string | null;

      price: price;

      translations: Array<{
        lang_id: string;

        payment_id: string;

        payment_name: string | null;

        payment_descr: string | null;

        payment_order_minimum_price?: number | null;

        customer_type?: string | null;
      }>;
    };

    lang: string;

    user_id?: number | null;

    quatro?: quatro;

    shop?: shop;

    posta?: {
      id: number;

      name: string;

      address: address;

      gps_latitude: number;

      gps_longitude: number;

      xml_details?: string;
    };

    vat_rate?: number;

    group_discount?: number;

    individual_discount?: number;

    discount_amount?: number;

    problems?: Array<{
      type?: string;

      readable?: string;

      payload?: {};

      step?: number;
    }>;

    card_number?: string;

    zasielkovna_id: string;

    dhl_parcel_shop_code?: string;

    chosen_gift?: {};

    note?: string;

    vat_groups?: {
      group_value?: {
        price?: number;

        price_without_vat?: number;

        vat_rate?: number;
      };
    };

    last_updated?: string;

    last_ordered?: string;

    billing_company?: boolean;

    use_delivery_address?: boolean;

    terms_accept?: boolean;

    newsletter_accept?: boolean;

    heureka?: boolean;

    sale_explanation?: string;

    step?: number;

    delivery_address?: {};

    billing_address?: {};

    company?: company;

    domain_id?: number | null;

    vat_payer?: boolean;

    is_demand?: boolean;

    cart_label?: string | null;

    cart_type?: string | null;

    weight?: number;

    zasielkovna_payload?: {};

    pickup_id: string;

    pickup_payload?: {};
  }> {
    let path = '/cart/{cart_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Set type of delivery and payment, billing information, ...
   * @method
   * @name API#updateCart
   */
  updateCart(
    cartId: string,
    parameters: {
      vatGroups?: 0 | 1;
    } = {},
    body: object,
  ): Promise<object> {
    let path = '/cart/{cart_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Uploads cart file
   * @method
   * @name API#uploadCartFile
   */
  uploadCartFile(
    documentType: 'DOCUMENT',
    cartId: string,
    parameters: {} = {},
    form: {
      file: {};

      recaptcha_token: string;
    },
  ): Promise<{
    path: string;
  }> {
    let path = '/cart/{cart_id}/documents/{document_type}/upload';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    path = path.replace('{document_type}', documentType.toString());

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      form,
      headers,
      queryParameters,
    );
  }
  /**
   * Set cart document
   * @method
   * @name API#createCartDocument
   */
  createCartDocument(
    documentType: 'CODE',
    cartId: string,
    parameters: {} = {},
    body: {
      payload: {
        code: string;
      };

      recaptcha_token: string;
    },
  ): Promise<{
    path: string;
  }> {
    let path = '/cart/{cart_id}/documents/{document_type}/payload';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{document_type}', documentType.toString());

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Delete cart file
   * @method
   * @name API#deleteCartFile
   */
  deleteCartFile(
    documentId: number,
    cartId: string,
    parameters: {} = {},
  ): Promise<{
    path: string;
  }> {
    let path = '/cart/{cart_id}/documents/{document_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{document_id}', documentId.toString());

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Applies giftcard/pointcard/card discount on items in cart
   * @method
   * @name API#addCard
   */
  addCard(
    cartId: string,
    parameters: {} = {},
    body: {
      card_number?: string;

      card_type: 'GIFTCARD' | 'POINTCARD' | 'CARD';

      pointcards?: Array<{
        count: number;

        id: string;
      }>;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/apply-card';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns delivery and payment methods
   * @method
   * @name API#getDeliveryPaymentInfo
   */
  getDeliveryPaymentInfo(
    cartId: string,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    delivery?: Array<{
      delivery_id: string;

      delivery_name: string;

      delivery_descr: string | null;

      multistore: 0 | 1;

      delivery_sort: number | null;

      delivery_priority: number;

      min_weight: number | null;

      max_weight: number | null;

      remote_id?: string | null;

      helios_id?: string | null;

      ans_product_code?: string | null;

      price: {
        currency_id: string;

        price: number | null;

        priceWithoutVat?: number | null;

        vatRate?: number;
      };

      translations: Array<{
        lang_id: string;

        delivery_id: string;

        delivery_name: string | null;

        delivery_descr: string | null;

        customer_type?: string | null;
      }>;

      payments: Array<payment>;
    }>;
  }> {
    let path = '/cart/{cart_id}/delivery-payment';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Info about remaining price needed to get free delivery
   * @method
   * @name API#getFreeDeliveryInfo
   */
  getFreeDeliveryInfo(
    cartId: string,
    parameters: {} = {},
  ): Promise<{
    cart_price?: number;

    currency?: string;

    remaining_price?: number;
  }> {
    let path = '/cart/{cart_id}/free-delivery';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns gifts tied to this concrete cart
   * @method
   * @name API#loadCartGifts
   */
  loadCartGifts(
    cartId: string,
    parameters: {
      sortDir?: string;
    } = {},
  ): Promise<{
    cart_gifts: Array<{
      product_id: string;

      product_name?: string;

      picture?: string;

      price_from: number;

      claimable: boolean;

      price_unlock: number;
    }>;
  }> {
    let path = '/cart/{cart_id}/gifts';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns total count of products and price of cart
   * @method
   * @name API#getCartInfo
   */
  getCartInfo(
    cartId: string,
    parameters: {} = {},
  ): Promise<{
    currency?: string;

    items_count?: number;

    step?: number;

    items_price?: number;

    items_price_without_vat?: number;

    total_price?: number;

    total_price_without_vat?: number;
  }> {
    let path = '/cart/{cart_id}/info';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Remove item on given index from cart and returns updated cart
   * @method
   * @name API#deleteCartItem
   */
  deleteCartItem(
    cartId: string,
    productId: number,
    goodId: number,
    parameters: {
      isDemand?: 0 | 1;
      vatGroups?: 0 | 1;
      configurationId?: string;
    } = {},
  ): Promise<object> {
    let path = '/cart/{cart_id}/items/{product_id}/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    if (typeof parameters['isDemand'] !== 'undefined') {
      queryParameters['is_demand'] = parameters['isDemand'];
    }

    queryParameters['is_demand'] = this.transformParameter(
      queryParameters['is_demand'],
    );

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    if (typeof parameters['configurationId'] !== 'undefined') {
      queryParameters['configuration_id'] = parameters['configurationId'];
    }

    queryParameters['configuration_id'] = this.transformParameter(
      queryParameters['configuration_id'],
    );

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Add item to cart or update count
   * @method
   * @name API#addCartItem
   */
  addCartItem(
    cartId: string,
    goodId: number,
    productId: number,
    parameters: {
      count?: number;
      currencyId?: string;
      isDemand?: 0 | 1;
      vatGroups?: 0 | 1;
    } = {},
    body: {
      configuration?: {};

      configuration_id?: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/items/{product_id}/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    if (typeof parameters['count'] !== 'undefined') {
      queryParameters['count'] = parameters['count'];
    }

    queryParameters['count'] = this.transformParameter(
      queryParameters['count'],
    );

    if (typeof parameters['currencyId'] !== 'undefined') {
      queryParameters['currency_id'] = parameters['currencyId'];
    }

    queryParameters['currency_id'] = this.transformParameter(
      queryParameters['currency_id'],
    );

    if (typeof parameters['isDemand'] !== 'undefined') {
      queryParameters['is_demand'] = parameters['isDemand'];
    }

    queryParameters['is_demand'] = this.transformParameter(
      queryParameters['is_demand'],
    );

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Update item payload
   * @method
   * @name API#updateItemPayload
   */
  updateItemPayload(
    cartId: string,
    goodId: number,
    parameters: {} = {},
    body: {
      payload: Array<{
        id?: string;

        value?: {};
      }>;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/items/{good_id}/payload';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Set custom note for cart
   * @method
   * @name API#addNote
   */
  addNote(
    cartId: string,
    parameters: {
      vatGroups?: 0 | 1;
    } = {},
    body: {
      note: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/note';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Set custom note for given item in cart
   * @method
   * @name API#addItemNote
   */
  addItemNote(
    cartId: string,
    goodId: number,
    parameters: {
      vatGroups?: 0 | 1;
    } = {},
    body: {
      note: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/note/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    path = path.replace('{good_id}', goodId.toString());

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Remove giftcard/pointcard/card from cart
   * @method
   * @name API#removeCard
   */
  removeCard(
    cartId: string,
    cardType: 'giftcard' | 'pointcard' | 'card',
    cardNumber: string,
    parameters: {
      vatGroups?: 0 | 1;
    } = {},
  ): Promise<object> {
    let path = '/cart/{cart_id}/remove-card/{card_type}/{card_number}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{cart_id}', cartId.toString());

    path = path.replace('{card_type}', cardType.toString());

    path = path.replace('{card_number}', cardNumber.toString());

    if (typeof parameters['vatGroups'] !== 'undefined') {
      queryParameters['vat_groups'] = parameters['vatGroups'];
    }

    queryParameters['vat_groups'] = this.transformParameter(
      queryParameters['vat_groups'],
    );

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns import id if successful
   * @method
   * @name API#importCart
   */
  importCart(
    parameters: {} = {},
    form: {
      file: {};
    },
  ): Promise<{
    importId: string;
  }> {
    let path = '/cart/import';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      form,
      headers,
      queryParameters,
    );
  }
  /**
   * returns current import cart status
   * @method
   * @name API#loadCartImportStatus
   */
  loadCartImportStatus(
    importId: string,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    importId: number;

    importStatus: string;

    cartId?: string;

    notImported?: Array<{}>;
  }> {
    let path = '/cart/import/{import_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{import_id}', importId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * change import status
   * @method
   * @name API#changeImportStatus
   */
  changeImportStatus(
    importId: string,
    parameters: {} = {},
    body: {
      status: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    importId?: number;

    importStatus?: string;

    cartId?: string;
  }> {
    let path = '/cart/import/{import_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{import_id}', importId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * returns zoneId by zip
   * @method
   * @name API#findZoneByZipCode
   */
  findZoneByZipCode(parameters: { zip: string }): Promise<{
    zoneId: number;
  }> {
    let path = '/cart/zone';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['zip'] !== 'undefined') {
      queryParameters['zip'] = parameters['zip'];
    }

    queryParameters['zip'] = this.transformParameter(queryParameters['zip']);

    if (typeof parameters['zip'] === 'undefined') {
      throw new Error('Missing required parameter: zip');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Set delivery pickup point
   * @method
   * @name API#setPickupPoint
   */
  setPickupPoint(
    cartId: string,
    parameters: {} = {},
    body: {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/cart/{cart_id}/set-pickup-point';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{cart_id}', cartId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of category objects
   * @method
   * @name API#loadCategories
   */
  loadCategories(
    parameters: {
      showTop?: '0' | '1';
      withContent?: '0' | '1';
      webShow?: '0' | '1';
      q?: string;
      isFavorite?: '0' | '1';
      isRecommended?: '0' | '1';
      categoryTopParentId?: string;
      withPublish?: '0' | '1';
      publishLang?: string;
      hasNoRedirect?: '0' | '1';
      categoryName?: string;
      sort?: string;
      sortDir?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<Array<object>> {
    let path = '/categories';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['showTop'] !== 'undefined') {
      queryParameters['show_top'] = parameters['showTop'];
    }

    queryParameters['show_top'] = this.transformParameter(
      queryParameters['show_top'],
    );

    if (typeof parameters['withContent'] !== 'undefined') {
      queryParameters['with_content'] = parameters['withContent'];
    }

    queryParameters['with_content'] = this.transformParameter(
      queryParameters['with_content'],
    );

    queryParameters['web_show'] = '1';

    if (typeof parameters['webShow'] !== 'undefined') {
      queryParameters['web_show'] = parameters['webShow'];
    }

    queryParameters['web_show'] = this.transformParameter(
      queryParameters['web_show'],
    );

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    if (typeof parameters['isFavorite'] !== 'undefined') {
      queryParameters['is_favorite'] = parameters['isFavorite'];
    }

    queryParameters['is_favorite'] = this.transformParameter(
      queryParameters['is_favorite'],
    );

    if (typeof parameters['isRecommended'] !== 'undefined') {
      queryParameters['is_recommended'] = parameters['isRecommended'];
    }

    queryParameters['is_recommended'] = this.transformParameter(
      queryParameters['is_recommended'],
    );

    if (typeof parameters['categoryTopParentId'] !== 'undefined') {
      queryParameters['category_top_parent_id'] =
        parameters['categoryTopParentId'];
    }

    queryParameters['category_top_parent_id'] = this.transformParameter(
      queryParameters['category_top_parent_id'],
    );

    if (typeof parameters['withPublish'] !== 'undefined') {
      queryParameters['with_publish'] = parameters['withPublish'];
    }

    queryParameters['with_publish'] = this.transformParameter(
      queryParameters['with_publish'],
    );

    if (typeof parameters['publishLang'] !== 'undefined') {
      queryParameters['publish_lang'] = parameters['publishLang'];
    }

    queryParameters['publish_lang'] = this.transformParameter(
      queryParameters['publish_lang'],
    );

    if (typeof parameters['hasNoRedirect'] !== 'undefined') {
      queryParameters['has_no_redirect'] = parameters['hasNoRedirect'];
    }

    queryParameters['has_no_redirect'] = this.transformParameter(
      queryParameters['has_no_redirect'],
    );

    if (typeof parameters['categoryName'] !== 'undefined') {
      queryParameters['category_name'] = parameters['categoryName'];
    }

    queryParameters['category_name'] = this.transformParameter(
      queryParameters['category_name'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns CSV of categories
   * @method
   * @name API#loadCategoriesExport
   */
  loadCategoriesExport(parameters: {} = {}): Promise<object> {
    let path = '/categories/export';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns full category tree as an object
   * @method
   * @name API#loadTree
   */
  loadTree(
    parameters: {
      totalCounts?: '0' | '1';
      onlyVisible?: '0' | '1';
      withPublish?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<
    Array<{
      searchtype: string;

      category_name: string;

      category_descr: string;

      url: string;

      weburl: string;

      heureka_id: string | null;

      image: string | null;

      category_id: number;

      counts?: number;

      attribs?: Array<items>;

      children: Array<{}>;

      publish?: Array<{}>;

      is_top?: boolean;

      is_favorite?: boolean;

      is_popular?: boolean;

      is_recommended?: boolean;

      redirect_category_id?: number;

      category_number?: string | null;
    }>
  > {
    let path = '/categories/tree';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    queryParameters['total_counts'] = '1';

    if (typeof parameters['totalCounts'] !== 'undefined') {
      queryParameters['total_counts'] = parameters['totalCounts'];
    }

    queryParameters['total_counts'] = this.transformParameter(
      queryParameters['total_counts'],
    );

    if (typeof parameters['onlyVisible'] !== 'undefined') {
      queryParameters['only_visible'] = parameters['onlyVisible'];
    }

    queryParameters['only_visible'] = this.transformParameter(
      queryParameters['only_visible'],
    );

    if (typeof parameters['withPublish'] !== 'undefined') {
      queryParameters['with_publish'] = parameters['withPublish'];
    }

    queryParameters['with_publish'] = this.transformParameter(
      queryParameters['with_publish'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns full category tree as an object
   * @method
   * @name API#loadSimpleTree
   */
  loadSimpleTree(
    parameters: {
      publishLang?: string;
      maximumLevel?: number;
      maximumSubCategoriesOnLastLevel?: number;
      maxDocumentDataLevel?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<Array<items>> {
    let path = '/categories/simple-tree';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['publishLang'] !== 'undefined') {
      queryParameters['publish_lang'] = parameters['publishLang'];
    }

    queryParameters['publish_lang'] = this.transformParameter(
      queryParameters['publish_lang'],
    );

    if (typeof parameters['maximumLevel'] !== 'undefined') {
      queryParameters['maximum_level'] = parameters['maximumLevel'];
    }

    queryParameters['maximum_level'] = this.transformParameter(
      queryParameters['maximum_level'],
    );

    if (typeof parameters['maximumSubCategoriesOnLastLevel'] !== 'undefined') {
      queryParameters['maximum_sub_categories_on_last_level'] =
        parameters['maximumSubCategoriesOnLastLevel'];
    }

    queryParameters['maximum_sub_categories_on_last_level'] =
      this.transformParameter(
        queryParameters['maximum_sub_categories_on_last_level'],
      );

    if (typeof parameters['maxDocumentDataLevel'] !== 'undefined') {
      queryParameters['max_document_data_level'] =
        parameters['maxDocumentDataLevel'];
    }

    queryParameters['max_document_data_level'] = this.transformParameter(
      queryParameters['max_document_data_level'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns a category
   * @method
   * @name API#loadCategory
   */
  loadCategory(
    categoryId: number,
    parameters: {
      parameters?: Array<string>;
      attribValuesSorter?: 'NAME' | 'LANG_ORDER_NUMBER_SORT' | 'VALUE_SORT';
      withPublish?: '0' | '1';
      withAllLangs?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    category_id: number | null;

    catalog_id: number;

    lang_id: string;

    category_name: string;

    category_descr: string;

    cms_content_id: number | null;

    webshow: number;

    category_sort: number;

    image: string | null;

    category_number: string | null;

    url: string;

    searchtype: string | null;

    layout_style: string | null;

    parent_number: string | null;

    consultant_id: string | null;

    layout_id: string | null;

    tree_left: number;

    tree_right: number;

    tree_level: number;

    weburl: string | null;

    last_update: string | null;

    istop: number;

    type: 'CLASSIC' | 'WITH_SUBCATEGORIES';

    heureka_id: string | null;

    content?: Array<content>;

    category_name_alias: string | null;

    attribs?: Array<items>;

    helios_id?: number;

    compari_category_fullpath?: string;

    category_pairing_string?: string;

    is_top?: boolean;

    is_favorite?: boolean;

    is_popular?: boolean;

    is_recommended?: boolean;

    assembling?: boolean;

    blog_link?: string;

    outer_id?: string;

    redirect_category_id?: number;

    category_parent?: number;

    parent_categories?: Array<{}>;

    karat_id?: string;

    nautilus_category_id?: number;

    publish?: Array<{}>;
  }> {
    let path = '/categories/{category_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{category_id}', categoryId.toString());

    if (typeof parameters['parameters'] !== 'undefined') {
      queryParameters['parameters'] = parameters['parameters'];
    }

    queryParameters['parameters'] = this.transformParameter(
      queryParameters['parameters'],
    );

    if (typeof parameters['attribValuesSorter'] !== 'undefined') {
      queryParameters['attrib_values_sorter'] =
        parameters['attribValuesSorter'];
    }

    queryParameters['attrib_values_sorter'] = this.transformParameter(
      queryParameters['attrib_values_sorter'],
    );

    if (typeof parameters['withPublish'] !== 'undefined') {
      queryParameters['with_publish'] = parameters['withPublish'];
    }

    queryParameters['with_publish'] = this.transformParameter(
      queryParameters['with_publish'],
    );

    if (typeof parameters['withAllLangs'] !== 'undefined') {
      queryParameters['with_all_langs'] = parameters['withAllLangs'];
    }

    queryParameters['with_all_langs'] = this.transformParameter(
      queryParameters['with_all_langs'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of category objects
   * @method
   * @name API#loadRelatedCategories
   */
  loadRelatedCategories(
    categoryId: number,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/categories/{category_id}/related';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Assign brands to category
   * @method
   * @name API#assignBrands
   */
  assignBrands(
    categoryId: number,
    parameters: {} = {},
    body: {
      ids?: Array<number>;
    },
  ): Promise<object> {
    let path = '/categories/{category_id}/brands';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Load brands for category
   * @method
   * @name API#loadAssignBrands
   */
  loadAssignBrands(categoryId: number, parameters: {} = {}): Promise<{}> {
    let path = '/categories/{category_id}/brands';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns full category tree as an object
   * @method
   * @name API#loadSubTree
   */
  loadSubTree(
    categoryId: number,
    parameters: {
      withAttribs?: '0' | '1';
      withProductCounts?: '0' | '1';
      totalCounts?: '0' | '1';
      withPublish?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<Array<items>> {
    let path = '/categories/{category_id}/tree';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    queryParameters['with_attribs'] = '1';

    if (typeof parameters['withAttribs'] !== 'undefined') {
      queryParameters['with_attribs'] = parameters['withAttribs'];
    }

    queryParameters['with_attribs'] = this.transformParameter(
      queryParameters['with_attribs'],
    );

    queryParameters['with_product_counts'] = '1';

    if (typeof parameters['withProductCounts'] !== 'undefined') {
      queryParameters['with_product_counts'] = parameters['withProductCounts'];
    }

    queryParameters['with_product_counts'] = this.transformParameter(
      queryParameters['with_product_counts'],
    );

    queryParameters['total_counts'] = '1';

    if (typeof parameters['totalCounts'] !== 'undefined') {
      queryParameters['total_counts'] = parameters['totalCounts'];
    }

    queryParameters['total_counts'] = this.transformParameter(
      queryParameters['total_counts'],
    );

    path = path.replace('{category_id}', categoryId.toString());

    if (typeof parameters['withPublish'] !== 'undefined') {
      queryParameters['with_publish'] = parameters['withPublish'];
    }

    queryParameters['with_publish'] = this.transformParameter(
      queryParameters['with_publish'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of category objects
   * @method
   * @name API#loadBestSellers
   */
  loadBestSellers(
    categoryId: number,
    parameters: {
      currencyId?: string;
      langId?: string;
      limit?: number;
    } = {},
  ): Promise<{
    products?: Array<object>;
  }> {
    let path = '/categories/{category_id}/best_sellers';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    if (typeof parameters['currencyId'] !== 'undefined') {
      queryParameters['currency_id'] = parameters['currencyId'];
    }

    queryParameters['currency_id'] = this.transformParameter(
      queryParameters['currency_id'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns list of customers
   * @method
   * @name API#searchCustomers
   */
  searchCustomers(
    parameters: {
      limit?: number;
      name?: string;
      sort?: string;
      sortDir?: string;
      credibility?: '0' | '1';
      offset?: number;
    } = {},
  ): Promise<{
    customers: Array<{
      id: number;

      meno: string;

      priezvisko: string;

      firma: string | null;

      ico: string;

      dic: string;

      icdph: string;

      platba_dph: number;

      ulica: string;

      cislo: string;

      mesto: string;

      psc: string;

      country: string;

      telefon: string;

      email: string;

      login: string;

      ip: string;

      host: string;

      registrovany: string;

      stav: string;

      poznamka: string;

      nedoveryhodny: number;

      interna_poznamka: string;

      has_ip_access: number;

      individualna_zlava: number;

      lang: string;

      activatecode: string;

      activate_datetime: string | null;

      guid: string | null;

      login_hash: string;

      uniqid: string;

      card_number: string;

      reg_discount: number;

      delivery_addresses: object;

      autoregister: number | null;

      facebook_user_id: string;

      google_user_id: string;

      passwd: string;

      passwd_salt: string;

      trust_points?: number | null;

      highest_trust_points_reached?: number | null;
    }>;
  }> {
    let path = '/customers';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['name'] !== 'undefined') {
      queryParameters['name'] = parameters['name'];
    }

    queryParameters['name'] = this.transformParameter(queryParameters['name']);

    queryParameters['sort'] = 'date';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'desc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    if (typeof parameters['credibility'] !== 'undefined') {
      queryParameters['credibility'] = parameters['credibility'];
    }

    queryParameters['credibility'] = this.transformParameter(
      queryParameters['credibility'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Activate customer account
   * @method
   * @name API#activateUser
   */
  activateUser(parameters: { activationCode: string }): Promise<void> {
    let path = '/customers/activate';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['activationCode'] !== 'undefined') {
      queryParameters['activation_code'] = parameters['activationCode'];
    }

    queryParameters['activation_code'] = this.transformParameter(
      queryParameters['activation_code'],
    );

    if (typeof parameters['activationCode'] === 'undefined') {
      throw new Error('Missing required parameter: activationCode');
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * Create access token to enable reset user's password (token is valid 15
minutes)

    * @method
    * @name API#lostPassword
    */
  lostPassword(
    parameters: {} = {},
    body: {
      email: string;
    },
  ): Promise<void> {
    let path = '/customers/lost-password';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
    * Save new user's password and password salt into Db and remove access
token for password reset

    * @method
    * @name API#newPassword
    */
  newPassword(
    parameters: {},
    body: {
      new_password: string;
    },
    extraHeaders?: {
      xLostPasswordToken: string;
    },
  ): Promise<void> {
    let path = '/customers/new-password';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xLostPasswordToken'] !== 'undefined'
    ) {
      headers.append(
        'x-lost-password-token',
        extraHeaders['xLostPasswordToken']!,
      );
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer delivery address
   * @method
   * @name API#getDeliveryAddresses
   */
  getDeliveryAddresses(
    customerId: number,
    parameters: {
      addressId?: number;
      limit?: number;
      sort?: string;
      sortDir?: string;
    } = {},
  ): Promise<
    Array<{
      country?: string;

      created_at?: string;

      delivery_city?: string;

      delivery_number?: string;

      delivery_phone?: string;

      delivery_street?: string;

      delivery_zip?: string;

      delivery_email?: string;

      id?: number;

      id_user?: number;

      isDefault?: boolean;

      name?: string;

      surname?: string;

      helios_id?: number;

      external_id?: number;

      outer_id?: string;

      status?: string;

      ansId?: number;
    }>
  > {
    let path = '/customers/{customer_id}/delivery-address';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    if (typeof parameters['addressId'] !== 'undefined') {
      queryParameters['address_id'] = parameters['addressId'];
    }

    queryParameters['address_id'] = this.transformParameter(
      queryParameters['address_id'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    queryParameters['sort'] = 'created_at';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'asc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Create new customer's delivery address
   * @method
   * @name API#createNewDeliveryAddress
   */
  createNewDeliveryAddress(
    customerId: number,
    parameters: {} = {},
    body: {
      id_user?: number;

      id?: number;

      name: string;

      surname: string;

      delivery_street: string;

      delivery_number: string;

      delivery_zip: string;

      delivery_city: string;

      delivery_phone: string;

      country: string;

      delivery_email?: string;

      isDefault?: boolean;

      delivery_phone_prefix?: string;

      region?: string;
    },
  ): Promise<Array<object>> {
    let path = '/customers/{customer_id}/delivery-address';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer billing address
   * @method
   * @name API#getBillingAddresses
   */
  getBillingAddresses(
    customerId: number,
    parameters: {
      addressId?: number;
      limit?: number;
      sort?: string;
      sortDir?: string;
    } = {},
  ): Promise<Array<object>> {
    let path = '/customers/{customer_id}/billing-address';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    if (typeof parameters['addressId'] !== 'undefined') {
      queryParameters['address_id'] = parameters['addressId'];
    }

    queryParameters['address_id'] = this.transformParameter(
      queryParameters['address_id'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    queryParameters['sort'] = 'created_at';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'asc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Create new customer's billing address
   * @method
   * @name API#createNewBillingAddress
   */
  createNewBillingAddress(
    customerId: number,
    parameters: {} = {},
    body: {
      id?: number;

      id_user: number;

      name: string;

      surname: string;

      billing_street: string;

      billing_number: string;

      billing_zip: string;

      billing_city: string;

      billing_phone: string;

      country: string;
    },
  ): Promise<Array<object>> {
    let path = '/customers/{customer_id}/billing-address';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Get user info by user ID
   * @method
   * @name API#loadDashboard
   */
  loadDashboard(
    customerId: number,
    parameters: {} = {},
  ): Promise<{
    customers?: Array<{
      id: number;

      meno?: string;

      priezvisko?: string;

      firma?: string;

      ico?: string;

      dic?: string;

      icdph?: string;

      platca_dph?: number;

      ulica?: string;

      cislo?: string;

      mesto?: string;

      psc?: string;

      country?: string;

      telefon?: string;

      email?: string;

      login?: string;

      ip?: string;

      host?: string;

      registrovany?: string;

      stav?: string;

      poznamka?: string;

      nedoveryhodny?: boolean;

      interna_poznamka?: string;

      has_ip_access?: boolean;

      individualna_zlava?: number;

      lang?: string;

      activatecode?: string;

      activate_datetime?: string;

      guid?: string;

      login_hash?: string;

      uniqid?: string;

      card_number?: string;

      reg_discount?: boolean;

      delivery_addresses?: Array<{}>;

      autoregister?: number;

      trust_points?: number;

      highest_trust_points_reached?: number;

      naut_total_allowed_debt?: number;

      naut_bonita?: number;

      naut_user_credit?: number;

      naut_chain_credit?: number;

      naut_user_total_credit?: number;

      naut_chain_total_credit?: number;

      naut_current_month?: number;

      naut_min_month?: number;

      naut_min_sales_no_vat?: number;

      naut_min_sales?: number;

      naut_act_sales_no_vat?: number;

      naut_act_sales?: number;

      naut_min_chain_sales_no_vat?: number;

      naut_min_chain_sales?: number;

      naut_act_chain_sales_no_vat?: number;

      naut_act_chain_sales?: number;

      naut_min_contract_sale?: number;

      naut_phone?: string;

      naut_payment_due?: number;

      naut_turnover_value?: number;

      naut_turnover_value_no_vat?: number;

      naut_alcohol_sale_number?: string;

      naut_minimal_order_value?: number;

      naut_operator?: string;

      naut_sales_representative?: string;

      naut_points?: number;

      naut_tos_discount?: boolean;

      naut_allow_user_price_change?: boolean;

      naut_code?: string;

      naut_partner_id?: number;

      cart_id?: string;

      facebook_user_id?: string;

      google_user_id?: string;

      passwd?: string;

      passwd_salt?: string;

      history_points?: number;

      groupDetail?: {};

      updated_at?: string;

      helios_id?: number;

      unrestricted_order?: boolean;

      no_handling_fee?: boolean;

      b2b?: boolean;

      customPaymentEnabled?: boolean;

      customDeliveryEnabled?: boolean;

      shouldChangePassword?: boolean;

      parentUserId?: number;

      permissions?: number;

      customer_type?: string;

      clubGroups?: number;

      pohodaId?: number;

      ans_regnumber?: string;

      outer_id?: string;

      outer_payload?: number;

      updating_prices?: string;

      prices_updated_at?: string;

      parent?: {};

      import_lock?: number;

      subscribed?: boolean;

      karat_id?: string;

      ansId?: number;

      ansStatus?: string;
    }>;
  }> {
    let path = '/customers/{customer_id}/dashboard';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads products in customer orders
   * @method
   * @name API#loadOrderedProducts
   */
  loadOrderedProducts(
    customerId: number,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/customers/{customer_id}/ordered-products';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array with basic informations about product
   * @method
   * @name API#loadFavoriteProducts
   */
  loadFavoriteProducts(
    customerId: number,
    parameters: {
      limit?: number;
      offset?: number;
      sort?: string;
      sortDir?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    total: number;

    offset: number;

    price_min: number | null;

    price_max: number | null;

    limit: number;

    products: Array<object>;
  }> {
    let path = '/customers/{customer_id}/favorite-products';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array with basic informations about product
   * @method
   * @name API#loadFavoriteProductsForAnonymUser
   */
  loadFavoriteProductsForAnonymUser(
    parameters: {
      productIds: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<object> {
    let path = '/customers/{customer_id}/favorite-products-anonym';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['productIds'] !== 'undefined') {
      queryParameters['product_ids'] = parameters['productIds'];
    }

    queryParameters['product_ids'] = this.transformParameter(
      queryParameters['product_ids'],
    );

    if (typeof parameters['productIds'] === 'undefined') {
      throw new Error('Missing required parameter: productIds');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Unfavorite product (as customer)
   * @method
   * @name API#unfavoriteProduct
   */
  unfavoriteProduct(
    customerId: number,
    productId: number,
    parameters: {} = {},
  ): Promise<{}> {
    let path = '/customers/{customer_id}/favorite-products/{product_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Favorite product (as customer)
   * @method
   * @name API#favoriteProduct
   */
  favoriteProduct(
    customerId: number,
    productId: number,
    parameters: {} = {},
  ): Promise<{}> {
    let path = '/customers/{customer_id}/favorite-products/{product_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get orders by user ID
   * @method
   * @name API#getOrders
   */
  getOrders(
    customerId: number,
    parameters: {
      onlyActive?: '0' | '1';
      limit?: number;
      offset?: number;
      filterType?: 'DEMAND' | 'ORDERS' | 'BOTH';
    } = {},
  ): Promise<object> {
    let path = '/customers/{customer_id}/orders';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    if (typeof parameters['onlyActive'] !== 'undefined') {
      queryParameters['only_active'] = parameters['onlyActive'];
    }

    queryParameters['only_active'] = this.transformParameter(
      queryParameters['only_active'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    queryParameters['filter_type'] = 'ORDERS';

    if (typeof parameters['filterType'] !== 'undefined') {
      queryParameters['filter_type'] = parameters['filterType'];
    }

    queryParameters['filter_type'] = this.transformParameter(
      queryParameters['filter_type'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns number of favorite products for a user
   * @method
   * @name API#loadUserFavoriteProductsCount
   */
  loadUserFavoriteProductsCount(
    customerId: number,
    parameters: {} = {},
  ): Promise<{
    count?: number;
  }> {
    let path = '/customers/{customer_id}/favorite-count';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of transaction objects
   * @method
   * @name API#loadTransactions
   */
  loadTransactions(
    customerId: number,
    parameters: {
      dateStart?: string;
      dateEnd?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{
    current?: number;

    plus?: number;

    minus?: number;

    transactions?: Array<{
      id: number;

      id_user: number;

      id_order: number | null;

      amount: number;

      created_date: string;

      note: string;
    }>;
  }> {
    let path = '/customers/{customer_id}/points';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['dateStart'] !== 'undefined') {
      queryParameters['date_start'] = parameters['dateStart'];
    }

    queryParameters['date_start'] = this.transformParameter(
      queryParameters['date_start'],
    );

    if (typeof parameters['dateEnd'] !== 'undefined') {
      queryParameters['date_end'] = parameters['dateEnd'];
    }

    queryParameters['date_end'] = this.transformParameter(
      queryParameters['date_end'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Set custom order number to given good for a customer
   * @method
   * @name API#updateCustomOrderNumber
   */
  updateCustomOrderNumber(
    customerId: number,
    goodId: number,
    parameters: {} = {},
    body: {
      orderNr: string;
    },
  ): Promise<void> {
    let path = '/customers/{customer_id}/order-nr/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer's details
   * @method
   * @name API#getCustomerDetails
   */
  getCustomerDetails(
    id: number,
    parameters: {
      withParent?: string;
    } = {},
  ): Promise<{
    id: number;

    meno: string;

    priezvisko: string;

    firma: string;

    ico: string;

    dic: string;

    icdph: string;

    platca_dph: 0 | 1;

    ulica: string;

    cislo: string;

    mesto: string;

    psc: string;

    country: string;

    telefon: string;

    email: string;

    login: string;

    ip: string;

    host: string;

    registrovany: string;

    stav: string;

    poznamka: string;

    nedoveryhodny: boolean;

    interna_poznamka: string;

    has_ip_access: boolean;

    individualna_zlava: number;

    lang: string;

    activatecode: string;

    activate_datetime: string;

    guid: string;

    login_hash: string;

    uniqid: string;

    card_number: string;

    reg_discount: boolean;

    facebook_user_id: string;

    google_user_id: string;

    trust_points?: number;

    highest_trust_points_reached?: number;

    history_points?: {};

    delivery_addresses?: object;

    autoregister?: 0 | 1;

    naut_total_allowed_debt?: number;

    naut_bonita?: number;

    naut_user_credit?: number;

    naut_chain_credit?: number;

    naut_user_total_credit?: number;

    naut_chain_total_credit?: number;

    naut_current_month?: number;

    naut_min_month?: number;

    naut_min_sales_no_vat?: number;

    naut_min_sales?: number;

    naut_act_sales_no_vat?: number;

    naut_act_sales?: number;

    naut_min_chain_sales_no_vat?: number;

    naut_min_chain_sales?: number;

    naut_act_chain_sales_no_vat?: number;

    naut_act_chain_sales?: number;

    naut_min_contract_sale?: number;

    naut_phone?: string;

    naut_payment_due?: number;

    naut_turnover_value?: number;

    naut_turnover_value_no_vat?: number;

    naut_alcohol_sale_number?: number;

    naut_minimal_order_value?: number;

    naut_operator?: string;

    naut_sales_representative?: string;

    naut_points?: number;

    naut_tos_discount?: number;

    naut_allow_user_price_change?: 0 | 1;

    naut_code?: string;

    naut_partner_id?: number;

    cart_id?: string;

    passwd?: string;

    passwd_salt?: string;

    groupDetail?: {
      group_discount?: number;

      group_id?: number;

      vo?: boolean;

      custom_delivery_address?: boolean;

      custom_invoice_address?: boolean;
    };

    updated_at?: string;

    helios_id?: number;

    unrestricted_order?: 0 | 1;

    no_handling_fee?: 0 | 1;

    b2b?: 0 | 1;

    customPaymentEnabled?: 0 | 1;

    customDeliveryEnabled?: 0 | 1;

    shouldChangePassword?: boolean;

    parentUserId?: number;

    permissions?: number;

    customer_type?: string;

    clubGroups?: Array<{
      id?: number;

      title?: string;

      zlava?: number;

      autoAdd?: number;

      type?: string;
    }>;

    pohodaId?: number;

    ans_regnumber?: string;

    outer_id?: string;

    outer_payload?: string;

    updating_prices?: string;

    prices_updated_at?: string;

    parent?: {};

    import_lock?: number;

    subscribed?: boolean;

    karat_id?: string;

    ansId?: number;

    ansStatus?: string;
  }> {
    let path = '/customers/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    if (typeof parameters['withParent'] !== 'undefined') {
      queryParameters['with_parent'] = parameters['withParent'];
    }

    queryParameters['with_parent'] = this.transformParameter(
      queryParameters['with_parent'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Update customer's details
   * @method
   * @name API#updateCustomerDetails
   */
  updateCustomerDetails(
    id: number,
    parameters: {} = {},
    body: {
      id: number;

      meno: string;

      priezvisko: string;

      firma: string;

      ico: string;

      dic: string;

      icdph: string;

      platca_dph: 0 | 1;

      ulica: string;

      cislo: string;

      mesto: string;

      psc: string;

      country: string;

      telefon: string;

      email: string;

      login: string;

      ip: string;

      host: string;

      registrovany: string;

      stav: string;

      poznamka: string;

      nedoveryhodny: boolean;

      interna_poznamka: string;

      has_ip_access: boolean;

      individualna_zlava: number;

      lang: string;

      activatecode: string;

      activate_datetime: string;

      guid: string;

      login_hash: string;

      uniqid: string;

      card_number: string;

      reg_discount: boolean;

      facebook_user_id: string;

      google_user_id: string;

      trust_points?: number;

      highest_trust_points_reached?: number;

      history_points?: {};

      preferred_email?: string;

      phone_prefix?: string;

      country_code?: string;

      region?: string;
    },
  ): Promise<void> {
    let path = '/customers/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer's additional info
   * @method
   * @name API#loadAdditionalInfo
   */
  loadAdditionalInfo(id: number, parameters: {} = {}): Promise<{}> {
    let path = '/customers/{id}/additional-info';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer's ordered products
   * @method
   * @name API#loadi6OrderedProducts
   */
  loadi6OrderedProducts(
    id: number,
    parameters: {
      limit?: number;
      offset?: number;
      filterFrom?: string;
      filterTo?: string;
      categoryId?: string;
      brandId?: string;
      userOuterId?: string;
    } = {},
  ): Promise<{}> {
    let path = '/customers/{id}/order-items';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{id}', id.toString());

    if (typeof parameters['filterFrom'] !== 'undefined') {
      queryParameters['filter_from'] = parameters['filterFrom'];
    }

    queryParameters['filter_from'] = this.transformParameter(
      queryParameters['filter_from'],
    );

    if (typeof parameters['filterTo'] !== 'undefined') {
      queryParameters['filter_to'] = parameters['filterTo'];
    }

    queryParameters['filter_to'] = this.transformParameter(
      queryParameters['filter_to'],
    );

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    if (typeof parameters['brandId'] !== 'undefined') {
      queryParameters['brand_id'] = parameters['brandId'];
    }

    queryParameters['brand_id'] = this.transformParameter(
      queryParameters['brand_id'],
    );

    if (typeof parameters['userOuterId'] !== 'undefined') {
      queryParameters['user_outer_id'] = parameters['userOuterId'];
    }

    queryParameters['user_outer_id'] = this.transformParameter(
      queryParameters['user_outer_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get customer's backorders
   * @method
   * @name API#loadi6Backorders
   */
  loadi6Backorders(
    id: number,
    parameters: {
      limit?: number;
      offset?: number;
      categoryId?: string;
      brandId?: string;
      userOuterId?: string;
    } = {},
  ): Promise<{}> {
    let path = '/customers/{id}/backorders';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{id}', id.toString());

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    if (typeof parameters['brandId'] !== 'undefined') {
      queryParameters['brand_id'] = parameters['brandId'];
    }

    queryParameters['brand_id'] = this.transformParameter(
      queryParameters['brand_id'],
    );

    if (typeof parameters['userOuterId'] !== 'undefined') {
      queryParameters['user_outer_id'] = parameters['userOuterId'];
    }

    queryParameters['user_outer_id'] = this.transformParameter(
      queryParameters['user_outer_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get orders by user ID
   * @method
   * @name API#geti6Orders
   */
  geti6Orders(
    customerId: number,
    parameters: {
      onlyActive?: '0' | '1';
      limit?: number;
      offset?: number;
      filterType?: 'DEMAND' | 'ORDERS' | 'BOTH';
      userOuterId?: string;
      filterFrom?: string;
      filterTo?: string;
    } = {},
  ): Promise<object> {
    let path = '/customers/{customer_id}/i6-orders';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    if (typeof parameters['onlyActive'] !== 'undefined') {
      queryParameters['only_active'] = parameters['onlyActive'];
    }

    queryParameters['only_active'] = this.transformParameter(
      queryParameters['only_active'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    queryParameters['filter_type'] = 'ORDERS';

    if (typeof parameters['filterType'] !== 'undefined') {
      queryParameters['filter_type'] = parameters['filterType'];
    }

    queryParameters['filter_type'] = this.transformParameter(
      queryParameters['filter_type'],
    );

    if (typeof parameters['userOuterId'] !== 'undefined') {
      queryParameters['user_outer_id'] = parameters['userOuterId'];
    }

    queryParameters['user_outer_id'] = this.transformParameter(
      queryParameters['user_outer_id'],
    );

    if (typeof parameters['filterFrom'] !== 'undefined') {
      queryParameters['filter_from'] = parameters['filterFrom'];
    }

    queryParameters['filter_from'] = this.transformParameter(
      queryParameters['filter_from'],
    );

    if (typeof parameters['filterTo'] !== 'undefined') {
      queryParameters['filter_to'] = parameters['filterTo'];
    }

    queryParameters['filter_to'] = this.transformParameter(
      queryParameters['filter_to'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get order by order public id
   * @method
   * @name API#geti6Order
   */
  geti6Order(
    customerId: number,
    id: string,
    parameters: {} = {},
  ): Promise<object> {
    let path = '/customers/{customer_id}/i6-orders/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    path = path.replace('{id}', id.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load i6 customer's documents
   * @method
   * @name API#loadi6Documents
   */
  loadi6Documents(
    id: number,
    parameters: {
      limit?: number;
      offset?: number;
      filterFrom?: string;
      filterTo?: string;
      type?: 'INVOICE' | 'PREINVOICE' | 'CREDIT';
      paid?: '0' | '1';
    } = {},
  ): Promise<{}> {
    let path = '/customers/{id}/i6-documents';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['filterFrom'] !== 'undefined') {
      queryParameters['filter_from'] = parameters['filterFrom'];
    }

    queryParameters['filter_from'] = this.transformParameter(
      queryParameters['filter_from'],
    );

    if (typeof parameters['filterTo'] !== 'undefined') {
      queryParameters['filter_to'] = parameters['filterTo'];
    }

    queryParameters['filter_to'] = this.transformParameter(
      queryParameters['filter_to'],
    );

    path = path.replace('{id}', id.toString());

    if (typeof parameters['type'] !== 'undefined') {
      queryParameters['type'] = parameters['type'];
    }

    queryParameters['type'] = this.transformParameter(queryParameters['type']);

    if (typeof parameters['paid'] !== 'undefined') {
      queryParameters['paid'] = parameters['paid'];
    }

    queryParameters['paid'] = this.transformParameter(queryParameters['paid']);

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load customer's documents
   * @method
   * @name API#loadi6DocumentPdf
   */
  loadi6DocumentPdf(
    id: number,
    orderId: number,
    documentType: 'INVOICE' | 'PREINVOICE' | 'CREDIT',
    parameters: {} = {},
  ): Promise<{}> {
    let path = '/customers/{id}/i6-document/{order_id}/{document_type}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{order_id}', orderId.toString());

    path = path.replace('{document_type}', documentType.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Authorized customer can through this endpoint change his password
   * @method
   * @name API#changePassword
   */
  changePassword(
    customerId: number,
    parameters: {} = {},
    body: {
      current_password: string;

      new_password: string;

      password_check: string;
    },
    extraHeaders?: {
      xApiKey?: string;
    },
  ): Promise<void> {
    let path = '/customers/{customer_id}/change-password';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (extraHeaders && typeof extraHeaders['xApiKey'] !== 'undefined') {
      headers.append('X-API-Key', extraHeaders['xApiKey']!);
    }

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Delete particular customer's delivery address
   * @method
   * @name API#deleteDeliveryAddress
   */
  deleteDeliveryAddress(
    id: number,
    deliveryAddressId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/customers/{id}/delivery-address/{delivery_address_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{delivery_address_id}', deliveryAddressId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Update particular customer's delivery address
   * @method
   * @name API#updateDeliveryAddress
   */
  updateDeliveryAddress(
    id: number,
    deliveryAddressId: number,
    parameters: {} = {},
    body: object,
  ): Promise<void> {
    let path = '/customers/{id}/delivery-address/{delivery_address_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{delivery_address_id}', deliveryAddressId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Delete particular customer's billing address
   * @method
   * @name API#deleteBillingAddress
   */
  deleteBillingAddress(
    id: number,
    billingAddressId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/customers/{id}/billing-address/{billing_address_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{billing_address_id}', billingAddressId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Update particular customer's billing address
   * @method
   * @name API#updateBillingAddress
   */
  updateBillingAddress(
    id: number,
    billingAddressId: number,
    parameters: {} = {},
    body: object,
  ): Promise<void> {
    let path = '/customers/{id}/billing-address/{billing_address_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{billing_address_id}', billingAddressId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
    * **Authors**: Laci Perduk <perduk@bart.sk>

**Main usage**: Load child users for customer

    * @method
    * @name API#loadChildUsers
    */
  loadChildUsers(
    customerId: number,
    parameters: {
      columns?: string;
      onlyActive?: '0' | '1';
    } = {},
  ): Promise<{
    customers?: Array<{
      activate_datetime?: string;

      activatecode?: string;

      autoregister?: boolean;

      card_number?: string;

      cislo?: string;

      country?: string;

      delivery_addresses?: {};

      dic?: string;

      email?: string;

      facebook_user_id?: string;

      firma?: string;

      google_user_id?: string;

      groupDetail?: ClubUserGroupDetail;

      guid?: string;

      has_ip_access?: boolean;

      highest_trust_points_reached?: number;

      history_points?: {};

      host?: string;

      icdph?: string;

      ico?: string;

      id?: number;

      individualna_zlava?: number;

      interna_poznamka?: string;

      ip?: string;

      karat_id?: string;

      lang?: string;

      login?: string;

      login_hash?: string;

      meno?: string;

      mesto?: string;

      nedoveryhodny?: boolean;

      parentUserId?: number;

      passwd?: string;

      passwd_salt?: string;

      permissions?: number;

      platca_dph?: boolean;

      poznamka?: string;

      priezvisko?: string;

      psc?: string;

      reg_discount?: boolean;

      registrovany?: string;

      shouldChangePassword?: boolean;

      stav?: string;

      telefon?: string;

      trust_points?: number;

      ulica?: string;

      uniqid?: string;
    }>;
  }> {
    let path = '/customers/{customer_id}/child';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['columns'] !== 'undefined') {
      queryParameters['columns'] = parameters['columns'];
    }

    queryParameters['columns'] = this.transformParameter(
      queryParameters['columns'],
    );

    path = path.replace('{customer_id}', customerId.toString());

    queryParameters['only_active'] = '0';

    if (typeof parameters['onlyActive'] !== 'undefined') {
      queryParameters['only_active'] = parameters['onlyActive'];
    }

    queryParameters['only_active'] = this.transformParameter(
      queryParameters['only_active'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * **Authors**: Laci Perduk <perduk@bart.sk>

**Main usage**: Creates new customer as child customer

**DESCRIPTION**

In basic and current implementation of this method new user is created with property: **shouldChangePassword**.
New user after his first log in recieved e-mail with change password link and instructions to change password.

    * @method
    * @name API#createChildUser
    */
  createChildUser(
    customerId: number,
    parameters: {} = {},
    body: {
      email: string;

      password: string;

      name: string;

      surname: string;
    },
  ): Promise<void> {
    let path = '/customers/{customer_id}/child';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
    * **Authors**: Laci Perduk <perduk@bart.sk>

**Main usage**: Load child and siblings users for customer

    * @method
    * @name API#loadChildSiblingsUsers
    */
  loadChildSiblingsUsers(
    customerId: number,
    parameters: {
      columns?: string;
      onlyActive?: '0' | '1';
    } = {},
  ): Promise<{
    customers?: Array<items>;
  }> {
    let path = '/customers/{customer_id}/child-siblings';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['columns'] !== 'undefined') {
      queryParameters['columns'] = parameters['columns'];
    }

    queryParameters['columns'] = this.transformParameter(
      queryParameters['columns'],
    );

    path = path.replace('{customer_id}', customerId.toString());

    queryParameters['only_active'] = '0';

    if (typeof parameters['onlyActive'] !== 'undefined') {
      queryParameters['only_active'] = parameters['onlyActive'];
    }

    queryParameters['only_active'] = this.transformParameter(
      queryParameters['only_active'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * **Authors**: Laci Perduk <perduk@bart.sk>

**Main usage**: Deletes child users for concrete customer

**DESCRIPTION**

Possible problems:

- User you want to delete is not your child user
- Parent user has not sufficient permissions for deleting child users. Look at: ClubUserPermissionsService.ts

    * @method
    * @name API#deleteChildUser
    */
  deleteChildUser(
    customerId: number,
    childId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/customers/{customer_id}/child/{child_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{customer_id}', customerId.toString());

    path = path.replace('{child_id}', childId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * **Authors**: Laci Perduk <perduk@bart.sk>

**Main usage**: Loads related users for customer who is for example MANAGER

    * @method
    * @name API#loadCustomerRelations
    */
  loadCustomerRelations(
    customerId: number,
    parameters: {
      limit?: number;
      offset?: number;
      relation?: string;
      query?: string;
    } = {},
  ): Promise<void> {
    let path = '/customers/{customer_id}/relations';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{customer_id}', customerId.toString());

    if (typeof parameters['relation'] !== 'undefined') {
      queryParameters['relation'] = parameters['relation'];
    }

    queryParameters['relation'] = this.transformParameter(
      queryParameters['relation'],
    );

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Updates customer's email
   * @method
   * @name API#updateEmail
   */
  updateEmail(
    parameters: {} = {},
    body: {
      email?: string;

      password?: string;
    },
  ): Promise<void> {
    let path = '/customers/email';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Updates category in ElasticSearch
   * @method
   * @name API#loadElasticCategory
   */
  loadElasticCategory(
    categoryId: number,
    parameters: {
      sort?: string;
      sortDir?: 'desc' | 'asc';
      limit?: number;
      min?: number;
      max?: number;
      offset?: number;
      onlyAvailable?: '0' | '1';
      saleout?: '0' | '1';
      new?: '0' | '1';
      sale?: '0' | '1';
      langId: string;
      onlySubcategories: '0' | '1';
      activeAttribs?: string;
      age?: string;
      q?: string;
      onlyWithParent?: '0' | '1';
    },
  ): Promise<void> {
    let path = '/elastic/category/{category_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['sort'] = 'default';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'desc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['min'] !== 'undefined') {
      queryParameters['min'] = parameters['min'];
    }

    queryParameters['min'] = this.transformParameter(queryParameters['min']);

    if (typeof parameters['max'] !== 'undefined') {
      queryParameters['max'] = parameters['max'];
    }

    queryParameters['max'] = this.transformParameter(queryParameters['max']);

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    queryParameters['only_available'] = '0';

    if (typeof parameters['onlyAvailable'] !== 'undefined') {
      queryParameters['only_available'] = parameters['onlyAvailable'];
    }

    queryParameters['only_available'] = this.transformParameter(
      queryParameters['only_available'],
    );

    queryParameters['saleout'] = '0';

    if (typeof parameters['saleout'] !== 'undefined') {
      queryParameters['saleout'] = parameters['saleout'];
    }

    queryParameters['saleout'] = this.transformParameter(
      queryParameters['saleout'],
    );

    queryParameters['new'] = '0';

    if (typeof parameters['new'] !== 'undefined') {
      queryParameters['new'] = parameters['new'];
    }

    queryParameters['new'] = this.transformParameter(queryParameters['new']);

    queryParameters['sale'] = '0';

    if (typeof parameters['sale'] !== 'undefined') {
      queryParameters['sale'] = parameters['sale'];
    }

    queryParameters['sale'] = this.transformParameter(queryParameters['sale']);

    path = path.replace('{category_id}', categoryId.toString());

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    queryParameters['only_subcategories'] = '0';

    if (typeof parameters['onlySubcategories'] !== 'undefined') {
      queryParameters['only_subcategories'] = parameters['onlySubcategories'];
    }

    queryParameters['only_subcategories'] = this.transformParameter(
      queryParameters['only_subcategories'],
    );

    if (typeof parameters['onlySubcategories'] === 'undefined') {
      throw new Error('Missing required parameter: onlySubcategories');
    }

    if (typeof parameters['activeAttribs'] !== 'undefined') {
      queryParameters['active_attribs'] = parameters['activeAttribs'];
    }

    queryParameters['active_attribs'] = this.transformParameter(
      queryParameters['active_attribs'],
    );

    if (typeof parameters['age'] !== 'undefined') {
      queryParameters['age'] = parameters['age'];
    }

    queryParameters['age'] = this.transformParameter(queryParameters['age']);

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    queryParameters['only_with_parent'] = '0';

    if (typeof parameters['onlyWithParent'] !== 'undefined') {
      queryParameters['only_with_parent'] = parameters['onlyWithParent'];
    }

    queryParameters['only_with_parent'] = this.transformParameter(
      queryParameters['only_with_parent'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Updates category in ElasticSearch
   * @method
   * @name API#loadElasticCategoryProducts
   */
  loadElasticCategoryProducts(
    categoryId: number,
    parameters: {
      sort?: string;
      sortDir?: 'desc' | 'asc';
      limit?: number;
      min?: number;
      max?: number;
      offset?: number;
      onlyAvailable?: '0' | '1';
      onlyOnInternalStock?: '0' | '1';
      onlyOnExternalStock?: '0' | '1';
      saleout?: '0' | '1';
      langId: string;
      onlySubcategories: '0' | '1';
      activeAttribs?: string;
      activeRangeAttribs?: string;
      age?: string;
      new?: '0' | '1';
      sale?: '0' | '1';
      q?: string;
      domainId?: string;
      brandId?: string;
      onlyWithParent?: '0' | '1';
      isPopular?: '0' | '1';
      excludedProductIds?: string;
      onlyProducts?: '0' | '1';
      activeSlug?: string;
      gun?: string;
      contentUrl?: string;
    },
  ): Promise<void> {
    let path = '/elastic/category/{category_id}/products';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['sort'] = 'default';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'desc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['min'] !== 'undefined') {
      queryParameters['min'] = parameters['min'];
    }

    queryParameters['min'] = this.transformParameter(queryParameters['min']);

    if (typeof parameters['max'] !== 'undefined') {
      queryParameters['max'] = parameters['max'];
    }

    queryParameters['max'] = this.transformParameter(queryParameters['max']);

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    queryParameters['only_available'] = '0';

    if (typeof parameters['onlyAvailable'] !== 'undefined') {
      queryParameters['only_available'] = parameters['onlyAvailable'];
    }

    queryParameters['only_available'] = this.transformParameter(
      queryParameters['only_available'],
    );

    queryParameters['only_on_internal_stock'] = '0';

    if (typeof parameters['onlyOnInternalStock'] !== 'undefined') {
      queryParameters['only_on_internal_stock'] =
        parameters['onlyOnInternalStock'];
    }

    queryParameters['only_on_internal_stock'] = this.transformParameter(
      queryParameters['only_on_internal_stock'],
    );

    queryParameters['only_on_external_stock'] = '0';

    if (typeof parameters['onlyOnExternalStock'] !== 'undefined') {
      queryParameters['only_on_external_stock'] =
        parameters['onlyOnExternalStock'];
    }

    queryParameters['only_on_external_stock'] = this.transformParameter(
      queryParameters['only_on_external_stock'],
    );

    queryParameters['saleout'] = '0';

    if (typeof parameters['saleout'] !== 'undefined') {
      queryParameters['saleout'] = parameters['saleout'];
    }

    queryParameters['saleout'] = this.transformParameter(
      queryParameters['saleout'],
    );

    path = path.replace('{category_id}', categoryId.toString());

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    queryParameters['only_subcategories'] = '0';

    if (typeof parameters['onlySubcategories'] !== 'undefined') {
      queryParameters['only_subcategories'] = parameters['onlySubcategories'];
    }

    queryParameters['only_subcategories'] = this.transformParameter(
      queryParameters['only_subcategories'],
    );

    if (typeof parameters['onlySubcategories'] === 'undefined') {
      throw new Error('Missing required parameter: onlySubcategories');
    }

    if (typeof parameters['activeAttribs'] !== 'undefined') {
      queryParameters['active_attribs'] = parameters['activeAttribs'];
    }

    queryParameters['active_attribs'] = this.transformParameter(
      queryParameters['active_attribs'],
    );

    if (typeof parameters['activeRangeAttribs'] !== 'undefined') {
      queryParameters['active_range_attribs'] =
        parameters['activeRangeAttribs'];
    }

    queryParameters['active_range_attribs'] = this.transformParameter(
      queryParameters['active_range_attribs'],
    );

    if (typeof parameters['age'] !== 'undefined') {
      queryParameters['age'] = parameters['age'];
    }

    queryParameters['age'] = this.transformParameter(queryParameters['age']);

    queryParameters['new'] = '0';

    if (typeof parameters['new'] !== 'undefined') {
      queryParameters['new'] = parameters['new'];
    }

    queryParameters['new'] = this.transformParameter(queryParameters['new']);

    queryParameters['sale'] = '0';

    if (typeof parameters['sale'] !== 'undefined') {
      queryParameters['sale'] = parameters['sale'];
    }

    queryParameters['sale'] = this.transformParameter(queryParameters['sale']);

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['brandId'] !== 'undefined') {
      queryParameters['brand_id'] = parameters['brandId'];
    }

    queryParameters['brand_id'] = this.transformParameter(
      queryParameters['brand_id'],
    );

    queryParameters['only_with_parent'] = '0';

    if (typeof parameters['onlyWithParent'] !== 'undefined') {
      queryParameters['only_with_parent'] = parameters['onlyWithParent'];
    }

    queryParameters['only_with_parent'] = this.transformParameter(
      queryParameters['only_with_parent'],
    );

    queryParameters['is_popular'] = '0';

    if (typeof parameters['isPopular'] !== 'undefined') {
      queryParameters['is_popular'] = parameters['isPopular'];
    }

    queryParameters['is_popular'] = this.transformParameter(
      queryParameters['is_popular'],
    );

    if (typeof parameters['excludedProductIds'] !== 'undefined') {
      queryParameters['excluded_product_ids'] =
        parameters['excludedProductIds'];
    }

    queryParameters['excluded_product_ids'] = this.transformParameter(
      queryParameters['excluded_product_ids'],
    );

    queryParameters['only_products'] = '0';

    if (typeof parameters['onlyProducts'] !== 'undefined') {
      queryParameters['only_products'] = parameters['onlyProducts'];
    }

    queryParameters['only_products'] = this.transformParameter(
      queryParameters['only_products'],
    );

    if (typeof parameters['activeSlug'] !== 'undefined') {
      queryParameters['active_slug'] = parameters['activeSlug'];
    }

    queryParameters['active_slug'] = this.transformParameter(
      queryParameters['active_slug'],
    );

    if (typeof parameters['gun'] !== 'undefined') {
      queryParameters['gun'] = parameters['gun'];
    }

    queryParameters['gun'] = this.transformParameter(queryParameters['gun']);

    if (typeof parameters['contentUrl'] !== 'undefined') {
      queryParameters['content_url'] = parameters['contentUrl'];
    }

    queryParameters['content_url'] = this.transformParameter(
      queryParameters['content_url'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads articles from ElasticSearch
   * @method
   * @name API#loadElasticArticles
   */
  loadElasticArticles(parameters: {
    sort?: string;
    sortDir?: 'desc' | 'asc';
    limit?: number;
    offset?: number;
    langId: string;
    q?: string;
    domainId?: string;
  }): Promise<
    Array<{
      id: number;

      name: string;

      url: string;

      image: string;

      created_date: string;

      article_id: number;

      content: string;

      lang_id: string;

      sf_form: string;

      tags: Array<{
        id?: number;

        name?: string;

        identificator?: string;

        is_hidden?: boolean;

        is_top?: boolean;
      }>;

      sitemapIds: Array<number>;

      outerId: number;
    }>
  > {
    let path = '/elastic/articles';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['sort'] = 'default';

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'desc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads categories from ElasticSearch
   * @method
   * @name API#loadElasticCategories
   */
  loadElasticCategories(parameters: {
    limit?: number;
    offset?: number;
    langId: string;
    q?: string;
    isFavorite?: '0' | '1';
    isTop?: '0' | '1';
    isRecommended?: '0' | '1';
    isPopular?: '0' | '1';
  }): Promise<void> {
    let path = '/elastic/categories';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    if (typeof parameters['isFavorite'] !== 'undefined') {
      queryParameters['is_favorite'] = parameters['isFavorite'];
    }

    queryParameters['is_favorite'] = this.transformParameter(
      queryParameters['is_favorite'],
    );

    if (typeof parameters['isTop'] !== 'undefined') {
      queryParameters['is_top'] = parameters['isTop'];
    }

    queryParameters['is_top'] = this.transformParameter(
      queryParameters['is_top'],
    );

    if (typeof parameters['isRecommended'] !== 'undefined') {
      queryParameters['is_recommended'] = parameters['isRecommended'];
    }

    queryParameters['is_recommended'] = this.transformParameter(
      queryParameters['is_recommended'],
    );

    if (typeof parameters['isPopular'] !== 'undefined') {
      queryParameters['is_popular'] = parameters['isPopular'];
    }

    queryParameters['is_popular'] = this.transformParameter(
      queryParameters['is_popular'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads favorite categories from ElasticSearch and then load products for this categories
   * @method
   * @name API#loadFavoriteCategoriesList
   */
  loadFavoriteCategoriesList(parameters: {
    limit?: number;
    offset?: number;
    langId: string;
  }): Promise<void> {
    let path = '/elastic/favorite-categories-list';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns good details (content, photogallery, etc)
   * @method
   * @name API#loadGood
   */
  loadGood(
    goodId: string,
    parameters: {
      lang?: string;
    } = {},
  ): Promise<{
    priceinfo: string;

    valid_from?: string;

    valid_to?: string;

    imagePath: string;

    final_price: number | null;

    final_price_without_vat?: number | null;

    customer_discount?: number | null;

    b2b_discount?: number | null;

    unitprice_sale: number | null;

    sale: boolean | null;

    good_id: number;

    product_id: number;

    currency_id: string;

    unitprice: number;

    vat_rate: number;

    availability_id: number | null;

    oldprice: number | null;

    units: string | null;

    order_number: string | null;

    ean: string | null;

    internal_code: string | null;

    on_stock_count: number;

    is_on_stock: 0 | 1;

    point_good: 0 | 1;

    points_amount: number | null;

    sale_percentage: number | null;

    price_without_vat: number | null;

    price_without_vat_sale: number | null;

    currency: {
      id: string;

      name: string;
    };

    availability: {
      avail_id?: number;

      avail_uniqid?: string;

      order_available?: number;

      translations?: Array<{
        avail_id: number;

        lang: string;

        avail_name: string;
      }>;
    };

    sum_price?: number | null;

    sum_price_without_vat?: number | null;

    sum_unpacking_cost?: number | null;

    group_price?: {
      unitprice: number;

      oldprice: number;

      sale_percentage: number;
    };

    discount_pcn?: number;

    color?: Array<{}>;
  }> {
    let path = '/goods/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{good_id}', goodId.toString());

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Heureka eshop reviews
   * @method
   * @name API#loadHeurekaEshopReviews
   */
  loadHeurekaEshopReviews(
    parameters: {
      limit?: number;
      offset?: number;
      totalRatingMore?: number;
      hasSummary?: '0' | '1';
      reviewIds?: string;
    } = {},
  ): Promise<{
    reviews?: Array<{
      rating_id: string;

      first_imported_at?: string;

      last_imported_at?: string;

      source?: string;

      unix_timestamp?: string;

      total_rating?: number;

      recommends?: number;

      delivery_time?: number;

      transport_quality?: number;

      communication?: number;

      summary?: string;

      order_id?: string;
    }>;
  }> {
    let path = '/heureka/eshop-reviews';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['totalRatingMore'] !== 'undefined') {
      queryParameters['total_rating_more'] = parameters['totalRatingMore'];
    }

    queryParameters['total_rating_more'] = this.transformParameter(
      queryParameters['total_rating_more'],
    );

    if (typeof parameters['hasSummary'] !== 'undefined') {
      queryParameters['has_summary'] = parameters['hasSummary'];
    }

    queryParameters['has_summary'] = this.transformParameter(
      queryParameters['has_summary'],
    );

    if (typeof parameters['reviewIds'] !== 'undefined') {
      queryParameters['review_ids'] = parameters['reviewIds'];
    }

    queryParameters['review_ids'] = this.transformParameter(
      queryParameters['review_ids'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads all available languages
   * @method
   * @name API#loadLangList
   */
  loadLangList(parameters: {} = {}): Promise<{
    languages?: Array<{
      lang_default?: '0' | '1';

      lang_id?: string;

      lang_name?: string;

      lang_sort?: number;
    }>;
  }> {
    let path = '/langs';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads translations for concrete language
   * @method
   * @name API#loadLangTranslation
   */
  loadLangTranslation(langId: string, parameters: {} = {}): Promise<{}> {
    let path = '/langs/{lang_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{lang_id}', langId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns last minutes including array of products
   * @method
   * @name API#searchLastMinutes
   */
  searchLastMinutes(
    parameters: {
      onlyValid?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    lastMinute?: object;
  }> {
    let path = '/last-minutes';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    queryParameters['only_valid'] = 1;

    if (typeof parameters['onlyValid'] !== 'undefined') {
      queryParameters['only_valid'] = parameters['onlyValid'];
    }

    queryParameters['only_valid'] = this.transformParameter(
      queryParameters['only_valid'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns information about last minute including array of products
   * @method
   * @name API#getLastMinute
   */
  getLastMinute(
    lastminuteName: string,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    id: number;

    name: string;

    validFrom: string;

    validTo: string;

    products: items;
  }> {
    let path = '/last-minutes/{lastminute_name}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{lastminute_name}', lastminuteName.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Subscribe to nesletter
   * @method
   * @name API#subscribeNewsletter
   */
  subscribeNewsletter(
    parameters: {} = {},
    body: {
      email: string;

      first_name: string;

      last_name: string;

      source: string;

      status: string;

      country?: string;
    },
  ): Promise<{}> {
    let path = '/newsletter/subscribe';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Unsubscribe from nesletter
   * @method
   * @name API#unsubscribeNewsletter
   */
  unsubscribeNewsletter(parameters: {} = {}): Promise<{}> {
    let path = '/newsletter/unsubscribe/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Exchange code token for token
   * @method
   * @name API#changeCodeForToken
   */
  changeCodeForToken(
    parameters: {} = {},
    body: {
      code?: string;
    },
  ): Promise<{}> {
    let path = '/oauth/change-code';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
    * Prihlasenie pouzivatela - ziskanie tokenu


Tato metoda bud vyhlasi neznamu chybu, alebo redirectne spat na
referrera, alebo redirectne na redirect uri s tokenom alebo inou chybou.


V pripade redirectu na referrera moze nastat nasledovne chyby:


- INVALID_REQUEST (XHR nie je povolene)

- INVALID_CLIENT (client_id je nezname)

- INVALID_REFERER (poziadavka bola odoslana zo blbej URL)

- INVALID_CREDENTIALS (login a heslo nie su vporiadku)

- INVALID_REDIRECT_URI (redirect uri nie je medzi zadanymi v zozname
aplikacii)

- INVALID_RESPONSE_TYPE (napriklad implicit metoda nemusi byt povolena
vsetkym apkam)


Referer je default /auth/authorize pokial nie
je uvedeny iny referrer ktory sa zhoduje s tymi nastavenymi v aplikacii.


Zaroven je vrateny status 302 a nastavena location hlavicka.

    * @method
    * @name API#oauthAuthorize
    */
  oauthAuthorize(parameters: {
    clientId: string;
    cartId?: string;
    redirectUri: string;
    responseType?: string;
    scope: string;
    state?: string;
    appSpace?: string;
    lang?: string;
  }): Promise<{}> {
    let path = '/oauth/authorize';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');

    if (typeof parameters['clientId'] !== 'undefined') {
      queryParameters['client_id'] = parameters['clientId'];
    }

    queryParameters['client_id'] = this.transformParameter(
      queryParameters['client_id'],
    );

    if (typeof parameters['clientId'] === 'undefined') {
      throw new Error('Missing required parameter: clientId');
    }

    if (typeof parameters['cartId'] !== 'undefined') {
      queryParameters['cart_id'] = parameters['cartId'];
    }

    queryParameters['cart_id'] = this.transformParameter(
      queryParameters['cart_id'],
    );

    if (typeof parameters['redirectUri'] !== 'undefined') {
      queryParameters['redirect_uri'] = parameters['redirectUri'];
    }

    queryParameters['redirect_uri'] = this.transformParameter(
      queryParameters['redirect_uri'],
    );

    if (typeof parameters['redirectUri'] === 'undefined') {
      throw new Error('Missing required parameter: redirectUri');
    }

    queryParameters['response_type'] = 'token';

    if (typeof parameters['responseType'] !== 'undefined') {
      queryParameters['response_type'] = parameters['responseType'];
    }

    queryParameters['response_type'] = this.transformParameter(
      queryParameters['response_type'],
    );

    if (typeof parameters['scope'] !== 'undefined') {
      queryParameters['scope'] = parameters['scope'];
    }

    queryParameters['scope'] = this.transformParameter(
      queryParameters['scope'],
    );

    if (typeof parameters['scope'] === 'undefined') {
      throw new Error('Missing required parameter: scope');
    }

    if (typeof parameters['state'] !== 'undefined') {
      queryParameters['state'] = parameters['state'];
    }

    queryParameters['state'] = this.transformParameter(
      queryParameters['state'],
    );

    if (typeof parameters['appSpace'] !== 'undefined') {
      queryParameters['appSpace'] = parameters['appSpace'];
    }

    queryParameters['appSpace'] = this.transformParameter(
      queryParameters['appSpace'],
    );

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Facebook authentication - Redirects to Facebook server
   * @method
   * @name API#facebook
   */
  facebook(
    parameters: {
      state?: string;
    } = {},
  ): Promise<{}> {
    let path = '/oauth/facebook';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['state'] !== 'undefined') {
      queryParameters['state'] = parameters['state'];
    }

    queryParameters['state'] = this.transformParameter(
      queryParameters['state'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Facebook callback URL called when login form from FB has been confirmed
   * @method
   * @name API#facebookHandler
   */
  facebookHandler(
    parameters: {
      code?: string;
      state?: string;
    } = {},
  ): Promise<{}> {
    let path = '/oauth/facebook-callback';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['code'] !== 'undefined') {
      queryParameters['code'] = parameters['code'];
    }

    queryParameters['code'] = this.transformParameter(queryParameters['code']);

    if (typeof parameters['state'] !== 'undefined') {
      queryParameters['state'] = parameters['state'];
    }

    queryParameters['state'] = this.transformParameter(
      queryParameters['state'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Google authentication - Redirects to Google server
   * @method
   * @name API#google
   */
  google(
    parameters: {
      state?: string;
    } = {},
  ): Promise<{}> {
    let path = '/oauth/google';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['state'] !== 'undefined') {
      queryParameters['state'] = parameters['state'];
    }

    queryParameters['state'] = this.transformParameter(
      queryParameters['state'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * Google callback URL called when login form from Google has been
confirmed

    * @method
    * @name API#googleHandler
    */
  googleHandler(
    parameters: {
      code?: string;
      state?: string;
    } = {},
  ): Promise<{}> {
    let path = '/oauth/google-callback';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['code'] !== 'undefined') {
      queryParameters['code'] = parameters['code'];
    }

    queryParameters['code'] = this.transformParameter(queryParameters['code']);

    if (typeof parameters['state'] !== 'undefined') {
      queryParameters['state'] = parameters['state'];
    }

    queryParameters['state'] = this.transformParameter(
      queryParameters['state'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Fow now used to remove user ID from his cart
   * @method
   * @name API#oauthLogout
   */
  oauthLogout(
    parameters: {
      cartId?: string;
    } = {},
  ): Promise<{}> {
    let path = '/oauth/logout';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['cartId'] !== 'undefined') {
      queryParameters['cart_id'] = parameters['cartId'];
    }

    queryParameters['cart_id'] = this.transformParameter(
      queryParameters['cart_id'],
    );

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * After registration customer recieves activation email
   * @method
   * @name API#registerUser
   */
  registerUser(
    parameters: {} = {},
    body: {
      email: string;

      lang?: string;

      password: string;

      password_again: string;

      name?: string;

      surname?: string;

      token?: string;

      street?: string;

      city?: string;

      zip?: string;

      country?: string;

      phone?: string;

      company?: string;

      ico?: string;

      dic?: string;

      ic_dph?: string;

      customer_number?: string;

      want_b2b?: boolean;

      bio?: string;

      url?: string;

      phone_prefix?: string;

      region?: string;

      newsletter_accept?: boolean;
    },
  ): Promise<void> {
    let path = '/oauth/register';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * After registration customer recieves intial email
   * @method
   * @name API#registerB2B
   */
  registerB2B(
    parameters: {} = {},
    body: {
      additionalProperties?: {};

      name?: string;

      surname?: string;

      email?: string;

      phone?: string;

      login: string;

      password: string;

      bank_name: string;

      iban: string;

      bussiness_desc?: string;

      web?: string;

      note?: string;

      company: {
        name: string;

        ico: string;

        dic: string;

        ic_dph: string;

        vat_payer?: '0' | '1';
      };

      billing_address: {
        name: string;

        surname: string;

        street: string;

        number: string;

        city: string;

        zip: string;

        country: {
          name: string;

          value: string;
        };
      };

      lang: string;
    },
  ): Promise<void> {
    let path = '/oauth/register-b2b';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns information about token
   * @method
   * @name API#tokeninfo
   */
  tokeninfo(parameters: {
    accessToken: string;
    withGroups?: '0' | '1';
    lang?: string;
  }): Promise<{
    account_verified?: boolean;

    email?: number;

    id?: number;

    lang?: number;

    name?: number;

    surname?: number;

    token_info?: {};

    b2b?: number;

    updating_prices?: string;

    pricesUpdatedAt?: string;

    cartId?: string;

    pendingImportId?: string;

    doneImportId?: string;

    doneNotImported?: Array<{}>;

    trust_points?: number;
  }> {
    let path = '/oauth/tokeninfo';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['accessToken'] !== 'undefined') {
      queryParameters['access_token'] = parameters['accessToken'];
    }

    queryParameters['access_token'] = this.transformParameter(
      queryParameters['access_token'],
    );

    if (typeof parameters['accessToken'] === 'undefined') {
      throw new Error('Missing required parameter: accessToken');
    }

    queryParameters['with_groups'] = '0';

    if (typeof parameters['withGroups'] !== 'undefined') {
      queryParameters['with_groups'] = parameters['withGroups'];
    }

    queryParameters['with_groups'] = this.transformParameter(
      queryParameters['with_groups'],
    );

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get order by order public id
   * @method
   * @name API#getOrder
   */
  getOrder(
    id: string,
    parameters: {
      withStatuses?: 0 | 1;
      withIsReturningCustomer?: 0 | 1;
    } = {},
  ): Promise<{
    _id: number;

    order_id: number;

    order_nr: string;

    order_status: string;

    order_status_color: string;

    order_status_readable: string;

    order_type: string;

    order_tprice: number;

    order_tpricecurrency: string;

    created_datetime: string;

    order_cancelled_datetime: string | null;

    order_paid_datetime: string | null;

    order_ship_datetime: string | null;

    order_comments: string;

    shipnr: string | null;

    comments: string | null;

    order_lang: string;

    parent_order: number | null;

    vs: string;

    ac: string | null;

    credit_note: number;

    credit_note_number: number | null;

    credit_note_amount: number | null;

    credit_note_delivery: number;

    delivery_note_number: number | null;

    delivery_note_created_date: string | null;

    reservation_date: string | null;

    partner_id: number | null;

    oo_shop_id: number | null;

    oo_shop_name: string | null;

    oo_shop_address: string | null;

    consumed_points: number;

    assigned_points: number;

    giftcards: number;

    club_user_id: number | null;

    invoice_with_vat: number;

    invoice_number: number | null;

    invoice_created_date: string | null;

    invoice_maturity_date: string | null;

    invoice_delivery_date: string | null;

    public_id: string;

    error_message: string | null;

    person: {
      name: string | null;

      surname: string | null;

      phone: string | null;

      email: string | null;

      phonePrefix?: string | null;
    };

    address: {
      person?: person;

      street: string;

      street_number?: string;

      zip: string;

      city: string;

      country: string;

      country_code: string;

      country_id: string;

      company?: string;

      delivery_address_id?: number;
    };

    payment: {
      payment_type: string;

      payment_typename: string;

      payment_price: number;

      payment_pricecurrency: string;

      delivery_price: number;

      delivery_pricecurrency: string;

      order_tprice: number;

      order_tpricecurrency: string;

      vat_rate: number;

      discount: number;

      individual_discount: number;

      group_discount: number;

      discount_amount: number;

      paid_amount: number | null;

      paid_amount_from_wallet: number | null;

      paid_amount_from_wallet_returned?: number | null;

      card_number: string | null;
    };

    delivery: {
      person: person;

      delivery_firm: string | null;

      delivery_addr_street: string;

      delivery_addr_street_number: string;

      delivery_addr_city: string;

      delivery_addr_zip: string;

      delivery_addr_country: string;

      delivery_addr_country_code: string | null;

      delivery_type: string;

      delivery_typename: string;

      delivery_price: number;

      delivery_pricecurrency: string;

      posta_id: number | null;

      posta_name: string | null;

      posta_address: string | null;
    };

    quatro: {
      quatro_status: string | null;

      quatro_kod: string | null;

      quatro_url: string | null;

      quatro_oz: string | null;
    };

    company: company;

    items?: Array<{
      order_id: number;

      item_idx: number;

      ordernr: number;

      product_name: string;

      units: string | null;

      unitprice: number;

      vat_rate: number;

      quantity: number;

      credit_note_quantity: number | null;

      totalpoints: number;

      totalprice: number;

      currency: string;

      product_id: number;

      good_id: number;

      skladom: number | null;

      date_delivery: string | null;

      from_store_id: string | null;

      product_note: string | null;

      ean: string | null;

      product_picture: string | null;

      product_url: string | null;

      good_details?: string;

      good_details_json: {
        productName: string;

        productNote: string | null;

        units: string | null;

        ordernr: number;

        ean: string | null;

        internalcode: string | null;

        unitprice: {
          price: number;

          currency: string;

          excludeVat: number;

          vatRate: string;
        };

        onstock: number;

        onstockCount: string;

        orderAvailable: number;

        points: number;

        id: string;

        productId: string;

        productTypeId: string;

        hasSales: boolean;

        isFromSale: boolean;

        isFromGroupSale: boolean;

        isPointGood: number;

        pointAmount: number;

        availabilityId: string;

        availability: {
          name: string;

          uniqueid: string;

          id: string;

          lang: string;

          order_available: string;
        };

        attribs: Array<{}>;

        attribsByAttribId: {
          groupId: number;

          groupName: string;

          attribs: Array<{
            name: string;

            unit: string;

            htmlUnit: string;

            value: string | null;

            customValue: string;

            groupName: string | null;

            attribId: string;

            valueId: number | null;

            valueGroupId: number | null;

            groupId: number | null;

            orderDepend: number;

            hexadecimal: string | null;

            attrib_ordernr: number;

            default_for_cart: number | null;
          }>;
        };
      };

      is_meta_item?: boolean;
    }>;

    documents?: {
      faktura?: string;

      predfaktura?: string;

      dobropis?: string;
    };

    showPayment?: boolean;

    use_delivery_address?: boolean;

    chosen_gift_name?: string;

    chosen_gift_id?: string;

    sale_explanation?: string;

    shop?: {
      shop_id?: number;

      shop_name?: string;

      shop_address?: address;

      shop_description?: string;

      shop_openhours?: string;

      gps_latitude?: number;

      gps_longitude?: number;

      email?: string;

      phone?: string;

      shop_type?: string;
    };

    preinvoice_number?: number;

    preinvoice_created_date?: string;

    preinvoice_maturity_date?: string;

    vat_rate?: number;

    discount?: number;

    order_tprice_without_vat?: number;

    chosenGift?: {
      gift_name?: string;

      product_id?: string;
    };

    order_note?: string;

    payload?: string;

    postorder_processed?: boolean;

    zasielkovna_id?: string;

    dhl_parcel_shop_code?: string;

    karat_id?: string;

    karat_invoice?: string;

    helios_id?: string;

    is_demand?: boolean;

    helios_user_id?: number;

    analytics_sended?: number;

    outer_payment_id?: string;

    pohodaId?: number;

    delivery_address_id?: string;

    invoiceType?: string;

    invoicePath?: string;

    ansId?: string;

    cardpay_id?: string;

    cardpay_chargeback_time?: string;

    outer_id?: string;

    vat_payer?: boolean;

    total_items_price?: {
      currency_id?: string;

      price?: number;

      priceWithoutVat?: number;

      vatRate?: number;
    };

    club_user_id_original?: number;

    domain_id?: number;

    price_rounding_value?: number;
  }> {
    let path = '/orders/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    if (typeof parameters['withStatuses'] !== 'undefined') {
      queryParameters['with_statuses'] = parameters['withStatuses'];
    }

    queryParameters['with_statuses'] = this.transformParameter(
      queryParameters['with_statuses'],
    );

    if (typeof parameters['withIsReturningCustomer'] !== 'undefined') {
      queryParameters['with_is_returning_customer'] =
        parameters['withIsReturningCustomer'];
    }

    queryParameters['with_is_returning_customer'] = this.transformParameter(
      queryParameters['with_is_returning_customer'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Create order
   * @method
   * @name API#createOrder
   */
  createOrder(
    id: string,
    parameters: {} = {},
    body: {
      delivery?: {};

      payment?: {};

      delivery_address?: address;

      billing_address: address;

      company: {
        name: string | null;

        ico: string | null;

        dic: string | null;

        ic_dph: string | null;
      };

      billing_company: boolean;

      use_delivery_address: boolean;

      terms_accept: boolean;

      newsletter_accept: boolean;

      heureka: boolean;

      note: string;

      cart_label?: string;

      step: number;

      zasielkovna_id?: string;

      consumed_points: number;

      chosen_gift?: {};

      vat_payer?: boolean;

      register_user?: boolean;

      session_id?: string;
    },
  ): Promise<{
    orderPublicId: string;
  }> {
    let path = '/orders/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Update order responsible
   * @method
   * @name API#updateOrderResponsible
   */
  updateOrderResponsible(
    id: string,
    responsible: string,
    parameters: {} = {},
  ): Promise<{}> {
    let path = '/orders/{id}/responsible/{responsible}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    path = path.replace('{responsible}', responsible.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get order stock info
   * @method
   * @name API#getOrderStockInfo
   */
  getOrderStockInfo(orderId: string, parameters: {} = {}): Promise<object> {
    let path = '/order/{order_id}/stock-info';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{order_id}', orderId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get order stock info
   * @method
   * @name API#orderAfterUpdate
   */
  orderAfterUpdate(
    orderId: string,
    parameters: {
      processStocks: number;
    },
  ): Promise<object> {
    let path = '/order/{order_id}/after-update';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{order_id}', orderId.toString());

    if (typeof parameters['processStocks'] !== 'undefined') {
      queryParameters['process_stocks'] = parameters['processStocks'];
    }

    queryParameters['process_stocks'] = this.transformParameter(
      queryParameters['process_stocks'],
    );

    if (typeof parameters['processStocks'] === 'undefined') {
      throw new Error('Missing required parameter: processStocks');
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get order document
   * @method
   * @name API#orderDocument
   */
  orderDocument(
    publicId: string,
    document: 'faktura' | 'predfaktura' | 'dobropis',
    parameters: {
      directDownload?: 0 | 1;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{}> {
    let path = '/orders/{public_id}/documents/{document}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{public_id}', publicId.toString());

    path = path.replace('{document}', document.toString());

    queryParameters['direct_download'] = 1;

    if (typeof parameters['directDownload'] !== 'undefined') {
      queryParameters['direct_download'] = parameters['directDownload'];
    }

    queryParameters['direct_download'] = this.transformParameter(
      queryParameters['direct_download'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Get list of order statuses
   * @method
   * @name API#statuses
   */
  statuses(
    publicId: string,
    parameters: {} = {},
  ): Promise<{
    name?: {
      message?: string;

      step?: number;
    };
  }> {
    let path = '/orders/{public_id}/statuses';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{public_id}', publicId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with information about other text and its content
   * @method
   * @name API#loadOtherTexts
   */
  loadOtherTexts(
    textId: string,
    parameters: {
      langId?: string;
    } = {},
  ): Promise<{
    text_id: string;

    text_name: string;

    ordering: number;

    sfpform: string;

    text_group: string;

    content: {
      id: string | number;

      created_user_id: string | null;

      sitemap_item_id: string | null;

      name: string | null;

      created_date: string;

      ordering: number | null;

      sf_form: string;

      sf_stylesheet: string;

      sf_xmlcontent: string | null;

      draft: number;

      hint: string | null;

      url: string | null;

      last_update: string;

      rss: number;

      home: number;

      publish: number;

      json_content: string | null;

      documents?: Array<{
        document_id?: number;

        content_id?: number;

        document_name?: string | null;

        document_description?: string | null;

        document_path?: string | null;

        document_type?: string | null;

        created_date?: string | null;

        created_user?: number | null;

        privatedoc?: number | null;
      }>;

      downloads?: documents;

      photogallery?: documents;

      videos?: Array<{
        video_id?: number;

        content_id?: number;

        video_name?: string | null;

        video_description?: string | null;

        video_url?: string | null;

        ordering?: number | null;

        created_date?: string | null;

        created_user?: number | null;

        webshow?: number | null;

        video_width?: number | null;

        video_height?: number | null;
      }>;

      products?: items;

      next_article?: {
        name?: string;

        url?: string;

        image?: string;

        annotation?: string;

        id?: number;
      };

      tags?: Array<object>;

      lang_versions?: Array<{}>;
    };
  }> {
    let path = '/other-texts/{text_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{text_id}', textId.toString());

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Set order analytics sended
   * @method
   * @name API#updateOrderAnalytics
   */
  updateOrderAnalytics(publicId: string, parameters: {} = {}): Promise<void> {
    let path = '/orders/analytics/{public_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{public_id}', publicId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * You can specify category ID to get parameters only for products in
specific category

    * @method
    * @name API#loadProductAttribs
    */
  loadProductAttribs(
    parameters: {
      categoryId?: string;
      attribIds?: string;
      attribUniqueId?: string;
      brandId?: string;
      productType?: string;
      parameters?: string;
      sorter?: 'NAME' | 'LANG_ORDER_NUMBER_SORT' | 'VALUE_SORT';
      withoutHidden?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    product_attribs?: Array<{
      attrib_id: number;

      type_id: number;

      attrib_uid: string | null;

      attrib_type: string | null;

      group_id: number | null;

      attrib_name: string;

      attrib_ismulti: number;

      attrib_sort: number;

      attrib_pbl: number;

      attrib_unit: string;

      attrib_list: number;

      attrib_code: string | null;

      attrib_grid: number;

      min?: number;

      max?: number;

      translations: Array<{
        attrib_id: number;

        lang_id: string;

        attrib_name: string;

        attrib_unit: string | null;
      }>;

      values: Array<{
        amount: number;

        value_id: number;

        attrib_id: number;

        attrib_value: string;

        attrib_pict: string | null;

        group_id: number | null;

        istop: boolean;

        searchfilter: number;

        value_sort: number | null;

        translations: Array<{
          value_id: number;

          lang_id: string;

          attrib_value: string;
        }>;
      }>;
    }>;
  }> {
    let path = '/product-attribs';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    if (typeof parameters['attribIds'] !== 'undefined') {
      queryParameters['attrib_ids'] = parameters['attribIds'];
    }

    queryParameters['attrib_ids'] = this.transformParameter(
      queryParameters['attrib_ids'],
    );

    if (typeof parameters['attribUniqueId'] !== 'undefined') {
      queryParameters['attrib_unique_id'] = parameters['attribUniqueId'];
    }

    queryParameters['attrib_unique_id'] = this.transformParameter(
      queryParameters['attrib_unique_id'],
    );

    if (typeof parameters['brandId'] !== 'undefined') {
      queryParameters['brand_id'] = parameters['brandId'];
    }

    queryParameters['brand_id'] = this.transformParameter(
      queryParameters['brand_id'],
    );

    if (typeof parameters['productType'] !== 'undefined') {
      queryParameters['product_type'] = parameters['productType'];
    }

    queryParameters['product_type'] = this.transformParameter(
      queryParameters['product_type'],
    );

    if (typeof parameters['parameters'] !== 'undefined') {
      queryParameters['parameters'] = parameters['parameters'];
    }

    queryParameters['parameters'] = this.transformParameter(
      queryParameters['parameters'],
    );

    if (typeof parameters['sorter'] !== 'undefined') {
      queryParameters['sorter'] = parameters['sorter'];
    }

    queryParameters['sorter'] = this.transformParameter(
      queryParameters['sorter'],
    );

    if (typeof parameters['withoutHidden'] !== 'undefined') {
      queryParameters['without_hidden'] = parameters['withoutHidden'];
    }

    queryParameters['without_hidden'] = this.transformParameter(
      queryParameters['without_hidden'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product list info
   * @method
   * @name API#loadProductLists
   */
  loadProductLists(
    parameters: {
      limit?: number;
      offset?: number;
      query?: string;
    } = {},
  ): Promise<{
    list_id: string;

    list_name: string;

    grupa: string | null;

    ordernr: number;

    products: Array<object>;
  }> {
    let path = '/product-lists';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product list info
   * @method
   * @name API#loadProductList
   */
  loadProductList(
    listId: string,
    parameters: {
      limit?: number;
      offset?: number;
      withDocuments?: 0 | 1;
      onlyOnStock?: 0 | 1;
      withAttribs?: 0 | 1;
      publishLang?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<object> {
    let path = '/product-list/{list_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    path = path.replace('{list_id}', listId.toString());

    if (typeof parameters['withDocuments'] !== 'undefined') {
      queryParameters['with_documents'] = parameters['withDocuments'];
    }

    queryParameters['with_documents'] = this.transformParameter(
      queryParameters['with_documents'],
    );

    if (typeof parameters['onlyOnStock'] !== 'undefined') {
      queryParameters['only_on_stock'] = parameters['onlyOnStock'];
    }

    queryParameters['only_on_stock'] = this.transformParameter(
      queryParameters['only_on_stock'],
    );

    if (typeof parameters['withAttribs'] !== 'undefined') {
      queryParameters['with_attribs'] = parameters['withAttribs'];
    }

    queryParameters['with_attribs'] = this.transformParameter(
      queryParameters['with_attribs'],
    );

    if (typeof parameters['publishLang'] !== 'undefined') {
      queryParameters['publish_lang'] = parameters['publishLang'];
    }

    queryParameters['publish_lang'] = this.transformParameter(
      queryParameters['publish_lang'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product list info
   * @method
   * @name API#loadProductListProducts
   */
  loadProductListProducts(
    listId: string,
    parameters: {
      viewType?: ViewTypeEnum;
      lang: LangEnum;
    },
  ): Promise<object> {
    let path = '/product-list/{list_id}/products';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['viewType'] !== 'undefined') {
      queryParameters['view_type'] = parameters['viewType'];
    }

    queryParameters['view_type'] = this.transformParameter(
      queryParameters['view_type'],
    );

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    path = path.replace('{list_id}', listId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * You can filter list by currency, category and language
   * @method
   * @name API#searchProducts
   */
  searchProducts(
    parameters: {
      columns?: string;
      withoutCurrency?: '0' | '1';
      withGoods?: '0' | '1';
      withGifts?: '0' | '1';
      withAttribs?: '0' | '1';
      withBrand?: '0' | '1';
      withPublish?: '0' | '1';
      validFrom?: string;
      validTo?: string;
      onlyValidGoods?: '0' | '1';
      categoryId?: string;
      limit?: number;
      offset?: number;
      isSale?: '0' | '1';
      isSaleout?: '0' | '1';
      onStockSort?: number;
      isTop?: number;
      availabilityId?: number;
      brandId?: number;
      priceMin?: number;
      priceMax?: number;
      price?: number;
      productListId?: string;
      sort?: string;
      sortDir?: string;
      parameters?: Array<string>;
      ean?: string;
      plu?: string;
      internalCode?: string;
      q?: string;
      ageFilter?: string;
      street?: string;
      city?: string;
      zip?: string;
      onlyAvailableGoods?: string;
      onlyOnInternalStock?: '0' | '1';
      onlyOnExternalStock?: '0' | '1';
      productSystem?: string;
      isNew?: '0' | '1';
      withCustomOrderNr?: '0' | '1';
      withProductPackages?: '0' | '1';
      goodsWithStores?: '0' | '1';
      withParentCategories?: '0' | '1';
      withFreeDelivery?: '0' | '1';
      withColors?: '0' | '1';
      withSize?: '0' | '1';
      tagIds?: string;
      domainId?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    total: number;

    price_min: number;

    price_max: number;

    offset: number;

    limit: number;

    products: Array<Array<object>>;
  }> {
    let path = '/products';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    if (typeof parameters['columns'] !== 'undefined') {
      queryParameters['columns'] = parameters['columns'];
    }

    queryParameters['columns'] = this.transformParameter(
      queryParameters['columns'],
    );

    queryParameters['without_currency'] = '0';

    if (typeof parameters['withoutCurrency'] !== 'undefined') {
      queryParameters['without_currency'] = parameters['withoutCurrency'];
    }

    queryParameters['without_currency'] = this.transformParameter(
      queryParameters['without_currency'],
    );

    queryParameters['with_goods'] = '1';

    if (typeof parameters['withGoods'] !== 'undefined') {
      queryParameters['with_goods'] = parameters['withGoods'];
    }

    queryParameters['with_goods'] = this.transformParameter(
      queryParameters['with_goods'],
    );

    queryParameters['with_gifts'] = '1';

    if (typeof parameters['withGifts'] !== 'undefined') {
      queryParameters['with_gifts'] = parameters['withGifts'];
    }

    queryParameters['with_gifts'] = this.transformParameter(
      queryParameters['with_gifts'],
    );

    queryParameters['with_attribs'] = '1';

    if (typeof parameters['withAttribs'] !== 'undefined') {
      queryParameters['with_attribs'] = parameters['withAttribs'];
    }

    queryParameters['with_attribs'] = this.transformParameter(
      queryParameters['with_attribs'],
    );

    queryParameters['with_brand'] = '1';

    if (typeof parameters['withBrand'] !== 'undefined') {
      queryParameters['with_brand'] = parameters['withBrand'];
    }

    queryParameters['with_brand'] = this.transformParameter(
      queryParameters['with_brand'],
    );

    if (typeof parameters['withPublish'] !== 'undefined') {
      queryParameters['with_publish'] = parameters['withPublish'];
    }

    queryParameters['with_publish'] = this.transformParameter(
      queryParameters['with_publish'],
    );

    if (typeof parameters['validFrom'] !== 'undefined') {
      queryParameters['valid_from'] = parameters['validFrom'];
    }

    queryParameters['valid_from'] = this.transformParameter(
      queryParameters['valid_from'],
    );

    if (typeof parameters['validTo'] !== 'undefined') {
      queryParameters['valid_to'] = parameters['validTo'];
    }

    queryParameters['valid_to'] = this.transformParameter(
      queryParameters['valid_to'],
    );

    if (typeof parameters['onlyValidGoods'] !== 'undefined') {
      queryParameters['only_valid_goods'] = parameters['onlyValidGoods'];
    }

    queryParameters['only_valid_goods'] = this.transformParameter(
      queryParameters['only_valid_goods'],
    );

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    queryParameters['is_sale'] = '0';

    if (typeof parameters['isSale'] !== 'undefined') {
      queryParameters['is_sale'] = parameters['isSale'];
    }

    queryParameters['is_sale'] = this.transformParameter(
      queryParameters['is_sale'],
    );

    queryParameters['is_saleout'] = '0';

    if (typeof parameters['isSaleout'] !== 'undefined') {
      queryParameters['is_saleout'] = parameters['isSaleout'];
    }

    queryParameters['is_saleout'] = this.transformParameter(
      queryParameters['is_saleout'],
    );

    if (typeof parameters['onStockSort'] !== 'undefined') {
      queryParameters['on_stock_sort'] = parameters['onStockSort'];
    }

    queryParameters['on_stock_sort'] = this.transformParameter(
      queryParameters['on_stock_sort'],
    );

    if (typeof parameters['isTop'] !== 'undefined') {
      queryParameters['is_top'] = parameters['isTop'];
    }

    queryParameters['is_top'] = this.transformParameter(
      queryParameters['is_top'],
    );

    if (typeof parameters['availabilityId'] !== 'undefined') {
      queryParameters['availability_id'] = parameters['availabilityId'];
    }

    queryParameters['availability_id'] = this.transformParameter(
      queryParameters['availability_id'],
    );

    if (typeof parameters['brandId'] !== 'undefined') {
      queryParameters['brand_id'] = parameters['brandId'];
    }

    queryParameters['brand_id'] = this.transformParameter(
      queryParameters['brand_id'],
    );

    if (typeof parameters['priceMin'] !== 'undefined') {
      queryParameters['price_min'] = parameters['priceMin'];
    }

    queryParameters['price_min'] = this.transformParameter(
      queryParameters['price_min'],
    );

    if (typeof parameters['priceMax'] !== 'undefined') {
      queryParameters['price_max'] = parameters['priceMax'];
    }

    queryParameters['price_max'] = this.transformParameter(
      queryParameters['price_max'],
    );

    if (typeof parameters['price'] !== 'undefined') {
      queryParameters['price'] = parameters['price'];
    }

    queryParameters['price'] = this.transformParameter(
      queryParameters['price'],
    );

    if (typeof parameters['productListId'] !== 'undefined') {
      queryParameters['product_list_id'] = parameters['productListId'];
    }

    queryParameters['product_list_id'] = this.transformParameter(
      queryParameters['product_list_id'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    if (typeof parameters['parameters'] !== 'undefined') {
      queryParameters['parameters'] = parameters['parameters'];
    }

    queryParameters['parameters'] = this.transformParameter(
      queryParameters['parameters'],
    );

    if (typeof parameters['ean'] !== 'undefined') {
      queryParameters['ean'] = parameters['ean'];
    }

    queryParameters['ean'] = this.transformParameter(queryParameters['ean']);

    if (typeof parameters['plu'] !== 'undefined') {
      queryParameters['plu'] = parameters['plu'];
    }

    queryParameters['plu'] = this.transformParameter(queryParameters['plu']);

    if (typeof parameters['internalCode'] !== 'undefined') {
      queryParameters['internal_code'] = parameters['internalCode'];
    }

    queryParameters['internal_code'] = this.transformParameter(
      queryParameters['internal_code'],
    );

    if (typeof parameters['q'] !== 'undefined') {
      queryParameters['q'] = parameters['q'];
    }

    queryParameters['q'] = this.transformParameter(queryParameters['q']);

    if (typeof parameters['ageFilter'] !== 'undefined') {
      queryParameters['age_filter'] = parameters['ageFilter'];
    }

    queryParameters['age_filter'] = this.transformParameter(
      queryParameters['age_filter'],
    );

    if (typeof parameters['street'] !== 'undefined') {
      queryParameters['street'] = parameters['street'];
    }

    queryParameters['street'] = this.transformParameter(
      queryParameters['street'],
    );

    if (typeof parameters['city'] !== 'undefined') {
      queryParameters['city'] = parameters['city'];
    }

    queryParameters['city'] = this.transformParameter(queryParameters['city']);

    if (typeof parameters['zip'] !== 'undefined') {
      queryParameters['zip'] = parameters['zip'];
    }

    queryParameters['zip'] = this.transformParameter(queryParameters['zip']);

    if (typeof parameters['onlyAvailableGoods'] !== 'undefined') {
      queryParameters['only_available_goods'] =
        parameters['onlyAvailableGoods'];
    }

    queryParameters['only_available_goods'] = this.transformParameter(
      queryParameters['only_available_goods'],
    );

    queryParameters['only_on_internal_stock'] = '0';

    if (typeof parameters['onlyOnInternalStock'] !== 'undefined') {
      queryParameters['only_on_internal_stock'] =
        parameters['onlyOnInternalStock'];
    }

    queryParameters['only_on_internal_stock'] = this.transformParameter(
      queryParameters['only_on_internal_stock'],
    );

    queryParameters['only_on_external_stock'] = '0';

    if (typeof parameters['onlyOnExternalStock'] !== 'undefined') {
      queryParameters['only_on_external_stock'] =
        parameters['onlyOnExternalStock'];
    }

    queryParameters['only_on_external_stock'] = this.transformParameter(
      queryParameters['only_on_external_stock'],
    );

    if (typeof parameters['productSystem'] !== 'undefined') {
      queryParameters['product_system'] = parameters['productSystem'];
    }

    queryParameters['product_system'] = this.transformParameter(
      queryParameters['product_system'],
    );

    queryParameters['is_new'] = '0';

    if (typeof parameters['isNew'] !== 'undefined') {
      queryParameters['is_new'] = parameters['isNew'];
    }

    queryParameters['is_new'] = this.transformParameter(
      queryParameters['is_new'],
    );

    queryParameters['with_custom_order_nr'] = '0';

    if (typeof parameters['withCustomOrderNr'] !== 'undefined') {
      queryParameters['with_custom_order_nr'] = parameters['withCustomOrderNr'];
    }

    queryParameters['with_custom_order_nr'] = this.transformParameter(
      queryParameters['with_custom_order_nr'],
    );

    queryParameters['with_product_packages'] = '0';

    if (typeof parameters['withProductPackages'] !== 'undefined') {
      queryParameters['with_product_packages'] =
        parameters['withProductPackages'];
    }

    queryParameters['with_product_packages'] = this.transformParameter(
      queryParameters['with_product_packages'],
    );

    if (typeof parameters['goodsWithStores'] !== 'undefined') {
      queryParameters['goods_with_stores'] = parameters['goodsWithStores'];
    }

    queryParameters['goods_with_stores'] = this.transformParameter(
      queryParameters['goods_with_stores'],
    );

    if (typeof parameters['withParentCategories'] !== 'undefined') {
      queryParameters['with_parent_categories'] =
        parameters['withParentCategories'];
    }

    queryParameters['with_parent_categories'] = this.transformParameter(
      queryParameters['with_parent_categories'],
    );

    if (typeof parameters['withFreeDelivery'] !== 'undefined') {
      queryParameters['with_free_delivery'] = parameters['withFreeDelivery'];
    }

    queryParameters['with_free_delivery'] = this.transformParameter(
      queryParameters['with_free_delivery'],
    );

    if (typeof parameters['withColors'] !== 'undefined') {
      queryParameters['with_colors'] = parameters['withColors'];
    }

    queryParameters['with_colors'] = this.transformParameter(
      queryParameters['with_colors'],
    );

    if (typeof parameters['withSize'] !== 'undefined') {
      queryParameters['with_size'] = parameters['withSize'];
    }

    queryParameters['with_size'] = this.transformParameter(
      queryParameters['with_size'],
    );

    if (typeof parameters['tagIds'] !== 'undefined') {
      queryParameters['tag_ids'] = parameters['tagIds'];
    }

    queryParameters['tag_ids'] = this.transformParameter(
      queryParameters['tag_ids'],
    );

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * You can filter list by currency, category and language
   * @method
   * @name API#adminProductsAutocomplete
   */
  adminProductsAutocomplete(
    parameters: {
      query?: string;
      withoutGoods?: boolean;
    } = {},
  ): Promise<{}> {
    let path = '/products/autocomplete';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    if (typeof parameters['withoutGoods'] !== 'undefined') {
      queryParameters['withoutGoods'] = parameters['withoutGoods'];
    }

    queryParameters['withoutGoods'] = this.transformParameter(
      queryParameters['withoutGoods'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Export product attribs
   * @method
   * @name API#exportDsiProductsParameters
   */
  exportDsiProductsParameters(parameters: {} = {}): Promise<void> {
    let path = '/products/attribs/export';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads all product types
   * @method
   * @name API#loadProductTypes
   */
  loadProductTypes(parameters: {} = {}): Promise<
    Array<{
      type_id: number;

      catalog_id: number;

      type_name: string;

      type_descr: string;

      type_inherits: number;

      store_minqty: number;

      is_hidden: number;

      helios_id: string;

      ans_id: number;
    }>
  > {
    let path = '/product/types';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product questions
   * @method
   * @name API#loadQuestions
   */
  loadQuestions(
    parameters: {
      productId?: number;
      categoryId?: string;
      sort?: string;
      sortDir?: string;
      published?: '0' | '1';
      answered?: '0' | '1';
      limit?: number;
      offset?: number;
      langId?: string;
      includeProductInfo?: number;
      withoutEmpty?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    questions: Array<{
      answer: string;

      answer_date: string;

      categories: {
        categories: Array<{
          category_id: number;

          category_name: string;

          lang_id: string;
        }>;
      };

      category_id: string;

      email: string;

      id: number;

      ip: string;

      lang_id: string;

      phone: string;

      product_id: number;

      published: number;

      question: string;

      question_date: string;

      review?: number;

      username: string;

      club_user_id: number;
    }>;
  }> {
    let path = '/products/questions';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['productId'] !== 'undefined') {
      queryParameters['product_id'] = parameters['productId'];
    }

    queryParameters['product_id'] = this.transformParameter(
      queryParameters['product_id'],
    );

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    queryParameters['sort_dir'] = 'asc';

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    if (typeof parameters['published'] !== 'undefined') {
      queryParameters['published'] = parameters['published'];
    }

    queryParameters['published'] = this.transformParameter(
      queryParameters['published'],
    );

    if (typeof parameters['answered'] !== 'undefined') {
      queryParameters['answered'] = parameters['answered'];
    }

    queryParameters['answered'] = this.transformParameter(
      queryParameters['answered'],
    );

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['includeProductInfo'] !== 'undefined') {
      queryParameters['include_product_info'] =
        parameters['includeProductInfo'];
    }

    queryParameters['include_product_info'] = this.transformParameter(
      queryParameters['include_product_info'],
    );

    if (typeof parameters['withoutEmpty'] !== 'undefined') {
      queryParameters['without_empty'] = parameters['withoutEmpty'];
    }

    queryParameters['without_empty'] = this.transformParameter(
      queryParameters['without_empty'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * sends a product questions to the database
   * @method
   * @name API#insertQuestions
   */
  insertQuestions(
    parameters: {} = {},
    body: {
      category_id?: Array<number>;

      email: string;

      lang_id: string;

      phone: string;

      product_id: number;

      question: string;

      username: string;

      review?: number;

      positivePoints?: Array<string>;

      negativePoints?: Array<string>;

      parent_id?: number;
    },
  ): Promise<{
    status?: string;
  }> {
    let path = '/products/questions';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * returns selected product questions
   * @method
   * @name API#loadSelectedQuestions
   */
  loadSelectedQuestions(parameters: {} = {}): Promise<{
    questions: Array<{}>;
  }> {
    let path = '/products/selected-questions';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product questions total info
   * @method
   * @name API#loadQuestionsTotalInfo
   */
  loadQuestionsTotalInfo(
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    data?: {};
  }> {
    let path = '/products/questions/info';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product question categories
   * @method
   * @name API#loadQuestionCategories
   */
  loadQuestionCategories(
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    categories: Array<{
      category_id: number;

      category_name: string;

      lang_id: string;
    }>;
  }> {
    let path = '/products/questions/categories';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Creates a new question category in the database
   * @method
   * @name API#createCategory
   */
  createCategory(
    parameters: {} = {},
    body: {
      category_name: string;

      lang_id: string;
    },
  ): Promise<{
    status?: string;
  }> {
    let path = '/products/questions/categories';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns product question category detail
   * @method
   * @name API#loadCategoryDetail
   */
  loadCategoryDetail(
    categoryId: number,
    parameters: {} = {},
  ): Promise<{
    category_id: number;

    category_name: string;

    lang_id: string;
  }> {
    let path = '/products/questions/categories/{category_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Deletes category in the database
   * @method
   * @name API#deleteCategory
   */
  deleteCategory(
    categoryId: number,
    parameters: {} = {},
  ): Promise<{
    status?: string;
  }> {
    let path = '/products/questions/categories/{category_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Updates category in the database
   * @method
   * @name API#updateCategory
   */
  updateCategory(
    categoryId: number,
    parameters: {} = {},
    body: {
      category_name?: string;

      lang_id?: string;
    },
  ): Promise<{
    status?: {
      category_id: number;

      category_name: string;

      lang_id: string;
    };
  }> {
    let path = '/products/questions/categories/{category_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{category_id}', categoryId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * returns category info
   * @method
   * @name API#loadProduct
   */
  loadProduct(
    productId: number,
    parameters: {
      onlyValidGoods?: '0' | '1';
      published?: '0' | '1';
      goodsWithStores?: '0' | '1';
      withBreadcrumbs?: '0' | '1';
      withProductCategories?: '0' | '1';
      withConnectedArticles?: '0' | '1';
      withRelatedCategories?: '0' | '1';
      goodsWithSets?: '0' | '1';
      withParentCategories?: '0' | '1';
      withCustomOrderNr?: '0' | '1';
      withProductPackages?: '0' | '1';
      count?: number;
      withFreeDelivery?: '0' | '1';
      withContents?: '0' | '1';
      withProductVariants?: '0' | '1';
      topCategoryId?: string;
      domainId?: string;
      withDifferentCurrencies?: '0' | '1';
      activeGoodId?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<object> {
    let path = '/products/{product_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{product_id}', productId.toString());

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    if (typeof parameters['onlyValidGoods'] !== 'undefined') {
      queryParameters['only_valid_goods'] = parameters['onlyValidGoods'];
    }

    queryParameters['only_valid_goods'] = this.transformParameter(
      queryParameters['only_valid_goods'],
    );

    if (typeof parameters['published'] !== 'undefined') {
      queryParameters['published'] = parameters['published'];
    }

    queryParameters['published'] = this.transformParameter(
      queryParameters['published'],
    );

    if (typeof parameters['goodsWithStores'] !== 'undefined') {
      queryParameters['goods_with_stores'] = parameters['goodsWithStores'];
    }

    queryParameters['goods_with_stores'] = this.transformParameter(
      queryParameters['goods_with_stores'],
    );

    if (typeof parameters['withBreadcrumbs'] !== 'undefined') {
      queryParameters['with_breadcrumbs'] = parameters['withBreadcrumbs'];
    }

    queryParameters['with_breadcrumbs'] = this.transformParameter(
      queryParameters['with_breadcrumbs'],
    );

    if (typeof parameters['withProductCategories'] !== 'undefined') {
      queryParameters['with_product_categories'] =
        parameters['withProductCategories'];
    }

    queryParameters['with_product_categories'] = this.transformParameter(
      queryParameters['with_product_categories'],
    );

    if (typeof parameters['withConnectedArticles'] !== 'undefined') {
      queryParameters['with_connected_articles'] =
        parameters['withConnectedArticles'];
    }

    queryParameters['with_connected_articles'] = this.transformParameter(
      queryParameters['with_connected_articles'],
    );

    if (typeof parameters['withRelatedCategories'] !== 'undefined') {
      queryParameters['with_related_categories'] =
        parameters['withRelatedCategories'];
    }

    queryParameters['with_related_categories'] = this.transformParameter(
      queryParameters['with_related_categories'],
    );

    if (typeof parameters['goodsWithSets'] !== 'undefined') {
      queryParameters['goods_with_sets'] = parameters['goodsWithSets'];
    }

    queryParameters['goods_with_sets'] = this.transformParameter(
      queryParameters['goods_with_sets'],
    );

    if (typeof parameters['withParentCategories'] !== 'undefined') {
      queryParameters['with_parent_categories'] =
        parameters['withParentCategories'];
    }

    queryParameters['with_parent_categories'] = this.transformParameter(
      queryParameters['with_parent_categories'],
    );

    queryParameters['with_custom_order_nr'] = '0';

    if (typeof parameters['withCustomOrderNr'] !== 'undefined') {
      queryParameters['with_custom_order_nr'] = parameters['withCustomOrderNr'];
    }

    queryParameters['with_custom_order_nr'] = this.transformParameter(
      queryParameters['with_custom_order_nr'],
    );

    queryParameters['with_product_packages'] = '0';

    if (typeof parameters['withProductPackages'] !== 'undefined') {
      queryParameters['with_product_packages'] =
        parameters['withProductPackages'];
    }

    queryParameters['with_product_packages'] = this.transformParameter(
      queryParameters['with_product_packages'],
    );

    if (typeof parameters['count'] !== 'undefined') {
      queryParameters['count'] = parameters['count'];
    }

    queryParameters['count'] = this.transformParameter(
      queryParameters['count'],
    );

    if (typeof parameters['withFreeDelivery'] !== 'undefined') {
      queryParameters['with_free_delivery'] = parameters['withFreeDelivery'];
    }

    queryParameters['with_free_delivery'] = this.transformParameter(
      queryParameters['with_free_delivery'],
    );

    if (typeof parameters['withContents'] !== 'undefined') {
      queryParameters['with_contents'] = parameters['withContents'];
    }

    queryParameters['with_contents'] = this.transformParameter(
      queryParameters['with_contents'],
    );

    if (typeof parameters['withProductVariants'] !== 'undefined') {
      queryParameters['with_product_variants'] =
        parameters['withProductVariants'];
    }

    queryParameters['with_product_variants'] = this.transformParameter(
      queryParameters['with_product_variants'],
    );

    if (typeof parameters['topCategoryId'] !== 'undefined') {
      queryParameters['top_category_id'] = parameters['topCategoryId'];
    }

    queryParameters['top_category_id'] = this.transformParameter(
      queryParameters['top_category_id'],
    );

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['withDifferentCurrencies'] !== 'undefined') {
      queryParameters['with_different_currencies'] =
        parameters['withDifferentCurrencies'];
    }

    queryParameters['with_different_currencies'] = this.transformParameter(
      queryParameters['with_different_currencies'],
    );

    if (typeof parameters['activeGoodId'] !== 'undefined') {
      queryParameters['active_good_id'] = parameters['activeGoodId'];
    }

    queryParameters['active_good_id'] = this.transformParameter(
      queryParameters['active_good_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns product good price tag
   * @method
   * @name API#exportPriceTagPdf
   */
  exportPriceTagPdf(
    productId: number,
    goodId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/price-tag/{product_id}/{good_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns object of all connected products
   * @method
   * @name API#loadProductConnections
   */
  loadProductConnections(
    productId: number,
    parameters: {
      connectionType?: string;
      limit?: number;
      offset?: number;
      sort?: string;
      sortDir?: string;
      withCustomOrderNr?: '0' | '1';
      goodsWithStores?: '0' | '1';
      categoryId?: string;
      onlyOnStock?: number;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<{
    total: number;

    price_min: number;

    price_max: number;

    offset: number;

    limit: number;

    products: Array<{
      brand: {};

      created_at: string;

      description: string;

      ean: string;

      goods: Array<{
        availability: {
          avail_id?: number;

          avail_uniqid?: string;

          order_available?: number;

          translations?: Array<{
            avail_id: number;

            avail_name: string;

            lang: string;
          }>;
        };

        availability_id: number;

        currency: {
          id: string;

          name: string;
        };

        currency_id: string;

        discount_pcn?: number;

        ean: string;

        final_price: number;

        good_id: number;

        group_price?: {
          oldprice: number;

          sale_percentage: number;

          unitprice: number;
        };

        imagePath: string;

        internal_code: string;

        is_on_stock: '0' | '1';

        oldprice: number;

        on_stock_count: number;

        order_number: string;

        point_good: '0' | '1';

        points_amount: number;

        price_without_vat: number;

        price_without_vat_sale: number;

        product_id: number;

        sale: boolean;

        sale_percentage: number;

        unitprice: number;

        unitprice_sale: number;

        units: string;

        valid_from?: string;

        valid_to?: string;

        vat_rate: number;
      }>;

      is_new: '0' | '1';

      is_sale: '0' | '1';

      is_top: '0' | '1';

      issaleout: '0' | '1';

      main_good: {
        availability: {
          avail_id?: number;

          avail_uniqid?: string;

          order_available?: number;

          translations?: Array<{
            avail_id: number;

            avail_name: string;

            lang: string;
          }>;
        };

        availability_id: number;

        currency: {
          id: string;

          name: string;
        };

        currency_id: string;

        discount_pcn?: number;

        ean: string;

        final_price: number;

        good_id: number;

        group_price?: {
          oldprice: number;

          sale_percentage: number;

          unitprice: number;
        };

        imagePath: string;

        internal_code: string;

        is_on_stock: '0' | '1';

        oldprice: number;

        on_stock_count: number;

        order_number: string;

        point_good: '0' | '1';

        points_amount: number;

        price_without_vat: number;

        price_without_vat_sale: number;

        product_id: number;

        sale: boolean;

        sale_percentage: number;

        unitprice: number;

        unitprice_sale: number;

        units: string;

        valid_from?: string;

        valid_to?: string;

        vat_rate: number;
      };

      name: string;

      name_url_encoded: string;

      picture: string;

      plu: string;

      product_id: number;

      rating: string;

      rating_users: number;

      richness?: string;

      slogan: string;

      url: string;
    }>;
  }> {
    let path = '/products/{product_id}/connections';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{product_id}', productId.toString());

    if (typeof parameters['connectionType'] !== 'undefined') {
      queryParameters['connection_type'] = parameters['connectionType'];
    }

    queryParameters['connection_type'] = this.transformParameter(
      queryParameters['connection_type'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    queryParameters['with_custom_order_nr'] = '0';

    if (typeof parameters['withCustomOrderNr'] !== 'undefined') {
      queryParameters['with_custom_order_nr'] = parameters['withCustomOrderNr'];
    }

    queryParameters['with_custom_order_nr'] = this.transformParameter(
      queryParameters['with_custom_order_nr'],
    );

    if (typeof parameters['goodsWithStores'] !== 'undefined') {
      queryParameters['goods_with_stores'] = parameters['goodsWithStores'];
    }

    queryParameters['goods_with_stores'] = this.transformParameter(
      queryParameters['goods_with_stores'],
    );

    if (typeof parameters['categoryId'] !== 'undefined') {
      queryParameters['category_id'] = parameters['categoryId'];
    }

    queryParameters['category_id'] = this.transformParameter(
      queryParameters['category_id'],
    );

    if (typeof parameters['onlyOnStock'] !== 'undefined') {
      queryParameters['only_on_stock'] = parameters['onlyOnStock'];
    }

    queryParameters['only_on_stock'] = this.transformParameter(
      queryParameters['only_on_stock'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns average rating and all user ratings
   * @method
   * @name API#loadProductRatings
   */
  loadProductRatings(
    productId: number,
    parameters: {
      dateStart?: string;
      dateEnd?: string;
      limit?: number;
      offset?: number;
      sort?: string;
      sortDir?: 'asc' | 'desc';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    average_rating: string;

    rating_users: number;

    ratings: Array<{
      rate?: string;

      user_id?: number;
    }>;
  }> {
    let path = '/products/{product_id}/rating';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{product_id}', productId.toString());

    if (typeof parameters['dateStart'] !== 'undefined') {
      queryParameters['date_start'] = parameters['dateStart'];
    }

    queryParameters['date_start'] = this.transformParameter(
      queryParameters['date_start'],
    );

    if (typeof parameters['dateEnd'] !== 'undefined') {
      queryParameters['date_end'] = parameters['dateEnd'];
    }

    queryParameters['date_end'] = this.transformParameter(
      queryParameters['date_end'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['sort'] !== 'undefined') {
      queryParameters['sort'] = parameters['sort'];
    }

    queryParameters['sort'] = this.transformParameter(queryParameters['sort']);

    if (typeof parameters['sortDir'] !== 'undefined') {
      queryParameters['sort_dir'] = parameters['sortDir'];
    }

    queryParameters['sort_dir'] = this.transformParameter(
      queryParameters['sort_dir'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads data about prices of good for conrete customer
   * @method
   * @name API#loadProductGoodCustomersPrices
   */
  loadProductGoodCustomersPrices(
    productId: number,
    goodId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/products/{product_id}/{good_id}/customer-prices';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads data about prices of good for conrete customer
   * @method
   * @name API#loadProductGoodCustomerPrices
   */
  loadProductGoodCustomerPrices(
    productId: number,
    goodId: number,
    customerId: number,
    parameters: {} = {},
  ): Promise<void> {
    let path = '/products/{product_id}/{good_id}/customer-prices/{customer_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{customer_id}', customerId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * You must be registered user to do this
   * @method
   * @name API#watchAvailability
   */
  watchAvailability(
    productId: number,
    goodId: number,
    parameters: {} = {},
    body: {
      user_id: number;
    },
  ): Promise<void> {
    let path = '/products/{product_id}/{good_id}/watch-availability';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * You must be registered user to do this
   * @method
   * @name API#watchPrice
   */
  watchPrice(
    productId: number,
    goodId: number,
    parameters: {} = {},
    body: {
      user_id: number;
    },
  ): Promise<void> {
    let path = '/products/{product_id}/{good_id}/watch-price';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    path = path.replace('{good_id}', goodId.toString());

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
    * You can specify category ID to get availabilities on stock only for products in
specific category

    * @method
    * @name API#stateAvailabilitiesStock
    */
  stateAvailabilitiesStock(
    goodId: number,
    productId: number,
    parameters: {
      quantity: number;
    },
  ): Promise<{}> {
    let path = '/products/{product_id}/{good_id}/on-stock';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    if (typeof parameters['quantity'] !== 'undefined') {
      queryParameters['quantity'] = parameters['quantity'];
    }

    queryParameters['quantity'] = this.transformParameter(
      queryParameters['quantity'],
    );

    if (typeof parameters['quantity'] === 'undefined') {
      throw new Error('Missing required parameter: quantity');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
    * You can specify category ID to get availabilities on stock only for products in
specific category

    * @method
    * @name API#productDetailAttribs
    */
  productDetailAttribs(productId: number, parameters: {} = {}): Promise<{}> {
    let path = '/products/{product_id}/attribs';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load product goods info with stores and prices
   * @method
   * @name API#loadProductStoresAndPrices
   */
  loadProductStoresAndPrices(
    parameters: {
      productIds?: string;
    } = {},
  ): Promise<{}> {
    let path = '/store-price-info';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['productIds'] !== 'undefined') {
      queryParameters['product_ids'] = parameters['productIds'];
    }

    queryParameters['product_ids'] = this.transformParameter(
      queryParameters['product_ids'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load product goods info with stores and prices
   * @method
   * @name API#loadProductStoresAndPricesV2
   */
  loadProductStoresAndPricesV2(parameters: {
    lang: string;
    productIds: string;
  }): Promise<{}> {
    let path = '/store-price-info-v2';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    if (typeof parameters['productIds'] !== 'undefined') {
      queryParameters['product_ids'] = parameters['productIds'];
    }

    queryParameters['product_ids'] = this.transformParameter(
      queryParameters['product_ids'],
    );

    if (typeof parameters['productIds'] === 'undefined') {
      throw new Error('Missing required parameter: productIds');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Create DEPO shipment and print label
   * @method
   * @name API#createDepoShipmentAndPrintLabel
   */
  createDepoShipmentAndPrintLabel(
    parameters: {} = {},
    body: {
      order_id?: string | number;
    },
  ): Promise<{
    status?: string;
  }> {
    let path = '/depo/create-shipment-and-print-label/';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Print DEPO label
   * @method
   * @name API#printLabel
   */
  printLabel(
    parameters: {} = {},
    body: {
      order_id?: string | number;
    },
  ): Promise<{
    status?: string;
  }> {
    let path = '/depo/print-label/';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns current session info
   * @method
   * @name API#loadSessionInfo
   */
  loadSessionInfo(sessionId: string, parameters: {} = {}): Promise<object> {
    let path = '/session/{session_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{session_id}', sessionId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of key value pairs
   * @method
   * @name API#updateSessionInfo
   */
  updateSessionInfo(
    sessionId: string,
    parameters: {} = {},
    body: {
      click_id?: string;
    },
  ): Promise<object> {
    let path = '/session/{session_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{session_id}', sessionId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of key value pairs
   * @method
   * @name API#updateSessionConsentPayload
   */
  updateSessionConsentPayload(
    sessionId: string,
    parameters: {} = {},
    body: {
      accepted_categories?: Array<
        'necessary' | 'statistics' | 'marketing' | 'preferences'
      >;

      rejected_categories?: Array<
        'necessary' | 'statistics' | 'marketing' | 'preferences'
      >;

      revision?: number;

      consent_date?: string;

      consent_uuid?: string;

      last_consent_update?: string;

      accept_type?: string;
    },
  ): Promise<object> {
    let path = '/session/{session_id}/consent-payload';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{session_id}', sessionId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Returns array of key value pairs
   * @method
   * @name API#getSettings
   */
  getSettings(
    parameters: {
      domainId?: string;
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<
    Array<{
      name: string;

      value: string;

      public: number;

      admin_name: string;

      lang?: string;

      domain_id?: number;
    }>
  > {
    let path = '/settings';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns object with key value pair
   * @method
   * @name API#getSettingByName
   */
  getSettingByName(
    settingName: string,
    parameters: {
      domainId?: string;
      langId: string;
    },
  ): Promise<object> {
    let path = '/settings/{setting_name}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{setting_name}', settingName.toString());

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    if (typeof parameters['langId'] === 'undefined') {
      throw new Error('Missing required parameter: langId');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns sitemap with its content
   * @method
   * @name API#loadSitemaps
   */
  loadSitemaps(
    parameters: {
      sitemapUids: string;
      withLangVersions?: '0' | '1';
      withArticles?: '0' | '1';
      articlesLimit?: number;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    web_sitemap: Array<{
      access?: string;

      content?: default_1;

      created_date?: string;

      created_user_id?: number;

      descr_content_id?: number;

      display?: string;

      id?: number;

      image?: string;

      lang?: string;

      lang_version_id?: number;

      last_update?: string;

      layout_id?: string;

      link?: string;

      link_newwin?: number;

      locked?: number;

      name?: string;

      ordering?: number;

      parent_id?: number;

      private?: number;

      slogan?: string;

      title?: string;

      uniqid?: string;

      url?: string;

      webshow?: number;

      breadCrumbs?: Array<{}>;

      domain_id?: string;

      lang_versions?: Array<{}>;

      articles?: Array<{}>;

      sub_tree?: Array<{}>;

      children?: Array<{}>;
    }>;
  }> {
    let path = '/sitemaps';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['sitemapUids'] !== 'undefined') {
      queryParameters['sitemap_uids'] = parameters['sitemapUids'];
    }

    queryParameters['sitemap_uids'] = this.transformParameter(
      queryParameters['sitemap_uids'],
    );

    if (typeof parameters['sitemapUids'] === 'undefined') {
      throw new Error('Missing required parameter: sitemapUids');
    }

    if (typeof parameters['withLangVersions'] !== 'undefined') {
      queryParameters['with_lang_versions'] = parameters['withLangVersions'];
    }

    queryParameters['with_lang_versions'] = this.transformParameter(
      queryParameters['with_lang_versions'],
    );

    if (typeof parameters['withArticles'] !== 'undefined') {
      queryParameters['with_articles'] = parameters['withArticles'];
    }

    queryParameters['with_articles'] = this.transformParameter(
      queryParameters['with_articles'],
    );

    queryParameters['articles_limit'] = 10;

    if (typeof parameters['articlesLimit'] !== 'undefined') {
      queryParameters['articles_limit'] = parameters['articlesLimit'];
    }

    queryParameters['articles_limit'] = this.transformParameter(
      queryParameters['articles_limit'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns sitemap tree with its content
   * @method
   * @name API#loadSitemapTree
   */
  loadSitemapTree(
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    sitemap_tree: web_sitemap;
  }> {
    let path = '/sitemaps/tree';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns sitemap with its content
   * @method
   * @name API#loadSitemap
   */
  loadSitemap(
    sitemapUid: string,
    parameters: {
      withLangVersions?: '0' | '1';
      withSubtree?: '0' | '1';
      withArticles?: '0' | '1';
      articlesLimit?: number;
      includeSubtreeContents?: '0' | '1';
    } = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    id?: number;

    parent_id?: number | null;

    created_user_id?: number | null;

    created_date?: string;

    lang?: string;

    display?: string | null;

    name?: string;

    link?: string;

    ordering?: number;

    descr_content_id?: number | null;

    link_newwin?: number;

    access?: string;

    url?: string;

    webshow?: number;

    locked?: number;

    title?: string | null;

    uniqid?: string | null;

    last_update?: string;

    slogan?: string | null;

    layout_id?: string | null;

    private?: number;

    content?: object | null;

    lang_versions?: Array<{}>;
  }> {
    let path = '/sitemaps/{sitemap_uid}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    path = path.replace('{sitemap_uid}', sitemapUid.toString());

    if (typeof parameters['withLangVersions'] !== 'undefined') {
      queryParameters['with_lang_versions'] = parameters['withLangVersions'];
    }

    queryParameters['with_lang_versions'] = this.transformParameter(
      queryParameters['with_lang_versions'],
    );

    if (typeof parameters['withSubtree'] !== 'undefined') {
      queryParameters['with_subtree'] = parameters['withSubtree'];
    }

    queryParameters['with_subtree'] = this.transformParameter(
      queryParameters['with_subtree'],
    );

    if (typeof parameters['withArticles'] !== 'undefined') {
      queryParameters['with_articles'] = parameters['withArticles'];
    }

    queryParameters['with_articles'] = this.transformParameter(
      queryParameters['with_articles'],
    );

    queryParameters['articles_limit'] = 10;

    if (typeof parameters['articlesLimit'] !== 'undefined') {
      queryParameters['articles_limit'] = parameters['articlesLimit'];
    }

    queryParameters['articles_limit'] = this.transformParameter(
      queryParameters['articles_limit'],
    );

    if (typeof parameters['includeSubtreeContents'] !== 'undefined') {
      queryParameters['include_subtree_contents'] =
        parameters['includeSubtreeContents'];
    }

    queryParameters['include_subtree_contents'] = this.transformParameter(
      queryParameters['include_subtree_contents'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns sitemap tree with its content
   * @method
   * @name API#loadSitemapSubtree
   */
  loadSitemapSubtree(
    sitemapUid: string,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    sitemap_tree: web_sitemap;
  }> {
    let path = '/sitemaps/{sitemap_uid}/tree';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{sitemap_uid}', sitemapUid.toString());

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns information about all shops
   * @method
   * @name API#loadShops
   */
  loadShops(parameters: { lang: string; domainId?: string }): Promise<{
    shops: Array<{
      id: number;

      url: string;

      lang: string;

      company: string;

      boss: string;

      dic: string;

      ico: string;

      phone: string;

      email: string;

      name: string;

      descr_content_id: number;

      address: string;

      city: string;

      zip: string;

      state: string;

      gps_latitude: number;

      gps_longitude: number;

      opening_hours: Array<{}>;

      content?: content;
    }>;
  }> {
    let path = '/shops';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domainId'] = parameters['domainId'];
    }

    queryParameters['domainId'] = this.transformParameter(
      queryParameters['domainId'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns information about concrete shop by ID
   * @method
   * @name API#loadShopDetail
   */
  loadShopDetail(id: number, parameters: {} = {}): Promise<{}> {
    let path = '/shops/{id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    path = path.replace('{id}', id.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Shows information about custom urls
   * @method
   * @name API#getUrlMap
   */
  getUrlMap(
    parameters: {
      domainId?: string;
      url: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    type: string;

    data: {
      brand_id?: number;

      product_id?: number;

      category_id?: number;

      sitemap_id?: number;

      content_id?: number;

      new_url?: string;
    };
  }> {
    let path = '/url-map';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['url'] !== 'undefined') {
      queryParameters['url'] = parameters['url'];
    }

    queryParameters['url'] = this.transformParameter(queryParameters['url']);

    if (typeof parameters['url'] === 'undefined') {
      throw new Error('Missing required parameter: url');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Shows information about custom urls
   * @method
   * @name API#pairingImages
   */
  pairingImages(parameters: {} = {}): Promise<object> {
    let path = '/pair-images';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Loads info about URL redirection. If NOT 404 -> than redirects URL
   * @method
   * @name API#checkRedirect
   */
  checkRedirect(parameters: { url: string; langId?: string }): Promise<{
    createdDatetime?: string;

    id?: number;

    lang?: string;

    newUrl?: string;

    oldUrl?: string;

    redirectCode?: number;
  }> {
    let path = '/redirects';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['url'] !== 'undefined') {
      queryParameters['url'] = parameters['url'];
    }

    queryParameters['url'] = this.transformParameter(queryParameters['url']);

    if (typeof parameters['url'] === 'undefined') {
      throw new Error('Missing required parameter: url');
    }

    if (typeof parameters['langId'] !== 'undefined') {
      queryParameters['lang_id'] = parameters['langId'];
    }

    queryParameters['lang_id'] = this.transformParameter(
      queryParameters['lang_id'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Returns sets that contain this product
   * @method
   * @name API#loadsProductsSets
   */
  loadsProductsSets(
    productId: number,
    parameters: {} = {},
    extraHeaders?: {
      xAcceptLanguage?: string;
      xCurrency?: string;
    },
  ): Promise<object> {
    let path = '/products/{product_id}/sets';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (extraHeaders && typeof extraHeaders['xCurrency'] !== 'undefined') {
      headers.append('X-Currency', extraHeaders['xCurrency']!);
    }

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   *
   * @method
   * @name API#loadProductGoodConfigOptions
   */
  loadProductGoodConfigOptions(
    goodId: number,
    productId: number,
    parameters: {
      lang: string;
    },
  ): Promise<object> {
    let path = '/product/{product_id}/goods/{good_id}/config';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   *
   * @method
   * @name API#upsertProductGoodConfiguration
   */
  upsertProductGoodConfiguration(
    goodId: number,
    productId: number,
    parameters: {
      domainId: number;
      lang: string;
      dryRun?: 0 | 1;
      validate?: 0 | 1;
    },
    body: {
      type_id: number;

      configuration: Array<{
        widget_id: number;

        values: Array<{
          value_id: number;

          value?: string | number | boolean | null;
        }>;
      }>;
    },
  ): Promise<{}> {
    let path = '/product/{product_id}/goods/{good_id}/config';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['domainId'] === 'undefined') {
      throw new Error('Missing required parameter: domainId');
    }

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    if (typeof parameters['dryRun'] !== 'undefined') {
      queryParameters['dry_run'] = parameters['dryRun'];
    }

    queryParameters['dry_run'] = this.transformParameter(
      queryParameters['dry_run'],
    );

    if (typeof parameters['validate'] !== 'undefined') {
      queryParameters['validate'] = parameters['validate'];
    }

    queryParameters['validate'] = this.transformParameter(
      queryParameters['validate'],
    );

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   *
   * @method
   * @name API#loadProductGoodConfigOptionsByOrderNr
   */
  loadProductGoodConfigOptionsByOrderNr(parameters: {
    orderNr: string;
  }): Promise<{
    availability_date: string | null;

    is_in_wishlist: boolean;

    product_id: number;

    name: string;

    slogan: string | null;

    is_sale: 0 | 1;

    issaleout: 0 | 1;

    is_new: 0 | 1;

    is_top: 0 | 1;

    plu: string | null;

    ean: string | null;

    url: string;

    created_at: string;

    rating: string;

    rating_users: number;

    unpacking_cost?: number;

    picture: string | null;

    brand: {};

    name_url_encoded: string;

    qtyDiscounts?: {
      discount_pcn?: number;

      qty_from?: number;

      product_id?: number;

      lang?: string;

      final_price?: number;
    };

    goods: Array<object>;

    main_good: object;

    orderWithoutStock?: boolean;

    products_in_set?: Array<{
      good_id?: number;

      package_good_id?: number;

      package_quantity?: number;

      package_price?: number;

      product_id?: number;

      package_product_id?: number;

      color?: string;

      pages?: string;

      capacity?: string;
    }>;

    street?: string;

    city?: string;

    zip?: string;

    parent_categories: Array<{}>;

    assembling?: boolean;

    productPackages?: Array<{
      id?: number;

      productId?: number;

      storeQuantity?: number;

      fullQuantity?: number;

      type?: number;
    }>;

    category_text?: string;

    type?: {};

    brand_id?: number;

    locked?: number;

    picture_hash?: string;

    picture_media_script?: string;

    product_fts?: string;

    isactive?: number;

    internal_code?: number;

    issale_buy3_pay2?: number;

    ordered_count?: number;

    min_payment_priority?: number;

    min_delivery_priority?: number;

    heureka?: number;

    notshow?: number;

    ans_id?: string;

    b2cOrderAvailable?: boolean;

    b2bOrderAvailable?: boolean;

    istop?: boolean;

    is_favorite?: boolean;

    is_popular?: boolean;

    is_recommended?: boolean;

    helios_id?: number;

    status_b2b?: number;

    status_b2c?: number;

    allow_no_vat?: boolean;

    product_system?: string;

    picture_helios_id?: number;

    pohodaCode?: string;

    pohodaLastUpdate?: string;

    descr_hash?: string;

    sold_out?: boolean;

    group_name?: string;

    last_update?: string;

    buxus_page_id?: number;

    outer_id2?: number;

    outer_id3?: number;

    photogalleryImages?: Array<string>;

    product_additional_info?: Array<{}>;

    product_connections?: Array<string>;

    outer_payload?: string;

    karat_id?: string;

    product_condition?: string;

    outer_lock_price?: number;

    disable_solo_order?: number;

    product_weight?: number;

    disable_discount?: boolean;

    nautilus_id?: number;

    created_datetime?: string;

    type_id?: number;

    min_price?: number;

    max_price?: number;

    valid_from?: string;

    valid_to?: string;

    outer_id?: number;

    publish?: Array<{}>;
  }> {
    let path = '/product/config';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['orderNr'] !== 'undefined') {
      queryParameters['order_nr'] = parameters['orderNr'];
    }

    queryParameters['order_nr'] = this.transformParameter(
      queryParameters['order_nr'],
    );

    if (typeof parameters['orderNr'] === 'undefined') {
      throw new Error('Missing required parameter: orderNr');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   *
   * @method
   * @name API#loadProductGoodConfiguration
   */
  loadProductGoodConfiguration(
    configId: string,
    goodId: number,
    productId: number,
    parameters: {
      lang: string;
    },
  ): Promise<{}> {
    let path = '/product/{product_id}/goods/{good_id}/config/{config_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{config_id}', configId.toString());

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   *
   * @method
   * @name API#upsertProductGoodConfiguration_1
   */
  upsertProductGoodConfiguration_1(
    configId: string,
    goodId: number,
    productId: number,
    parameters: {
      dryRun?: 0 | 1;
      validate?: 0 | 1;
      domainId: number;
      lang: string;
    },
    body: {
      type_id: number;

      configuration: Array<{
        widget_id: number;

        values: Array<{
          payload?: {};

          value_id: number;

          value?: string | number | boolean | null;

          value1?: string | number | boolean | null;

          valueGunId?: string | number | boolean | null;

          value2?: string | number | boolean | null;
        }>;
      }>;
    },
  ): Promise<{}> {
    let path = '/product/{product_id}/goods/{good_id}/config/{config_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    path = path.replace('{config_id}', configId.toString());

    if (typeof parameters['dryRun'] !== 'undefined') {
      queryParameters['dry_run'] = parameters['dryRun'];
    }

    queryParameters['dry_run'] = this.transformParameter(
      queryParameters['dry_run'],
    );

    if (typeof parameters['validate'] !== 'undefined') {
      queryParameters['validate'] = parameters['validate'];
    }

    queryParameters['validate'] = this.transformParameter(
      queryParameters['validate'],
    );

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['domainId'] === 'undefined') {
      throw new Error('Missing required parameter: domainId');
    }

    if (typeof parameters['lang'] !== 'undefined') {
      queryParameters['lang'] = parameters['lang'];
    }

    queryParameters['lang'] = this.transformParameter(queryParameters['lang']);

    if (typeof parameters['lang'] === 'undefined') {
      throw new Error('Missing required parameter: lang');
    }

    path = path.replace('{good_id}', goodId.toString());

    path = path.replace('{product_id}', productId.toString());

    return this.request(
      'PUT',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * returns logo if successful
   * @method
   * @name API#uploadCustomerDocument
   */
  uploadCustomerDocument(
    parameters: {
      domainId: number;
    },
    form: {
      file: {};

      session_id?: string;

      recaptcha_token: string;
    },
  ): Promise<{
    logoId?: string;
  }> {
    let path = '/configurator/customer-uploads/upload';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    if (typeof parameters['domainId'] !== 'undefined') {
      queryParameters['domain_id'] = parameters['domainId'];
    }

    queryParameters['domain_id'] = this.transformParameter(
      queryParameters['domain_id'],
    );

    if (typeof parameters['domainId'] === 'undefined') {
      throw new Error('Missing required parameter: domainId');
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      form,
      headers,
      queryParameters,
    );
  }
  /**
   * Deletes customer upload
   * @method
   * @name API#deleteCustomerDocument
   */
  deleteCustomerDocument(
    uploadId: number,
    parameters: {
      recaptchaToken: string;
      sessionId?: string;
    },
  ): Promise<{
    logoId?: string;
  }> {
    let path = '/configurator/customer-uploads/upload/{upload_id}';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    path = path.replace('{upload_id}', uploadId.toString());

    if (typeof parameters['recaptchaToken'] !== 'undefined') {
      queryParameters['recaptcha_token'] = parameters['recaptchaToken'];
    }

    queryParameters['recaptcha_token'] = this.transformParameter(
      queryParameters['recaptcha_token'],
    );

    if (typeof parameters['recaptchaToken'] === 'undefined') {
      throw new Error('Missing required parameter: recaptchaToken');
    }

    if (typeof parameters['sessionId'] !== 'undefined') {
      queryParameters['session_id'] = parameters['sessionId'];
    }

    queryParameters['session_id'] = this.transformParameter(
      queryParameters['session_id'],
    );

    return this.request(
      'DELETE',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * You can filter list by currency, category and language
   * @method
   * @name API#configTypeAutoComplete
   */
  configTypeAutoComplete(
    parameters: {
      query?: string;
    } = {},
  ): Promise<{}> {
    let path = '/configurator/config/autocomplete';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['query'] !== 'undefined') {
      queryParameters['query'] = parameters['query'];
    }

    queryParameters['query'] = this.transformParameter(
      queryParameters['query'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * returns good cms_content_id by ordernr (content)
   * @method
   * @name API#loadGoodContentByOrderNr
   */
  loadGoodContentByOrderNr(parameters: { orderNr: string }): Promise<{}> {
    let path = '/configurator/good-content';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers = this.appendAuthHeaders(headers);
    headers.append('Accept', 'application/json');

    if (typeof parameters['orderNr'] !== 'undefined') {
      queryParameters['order_nr'] = parameters['orderNr'];
    }

    queryParameters['order_nr'] = this.transformParameter(
      queryParameters['order_nr'],
    );

    if (typeof parameters['orderNr'] === 'undefined') {
      throw new Error('Missing required parameter: orderNr');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Generate Braintree token which is passed to the client side for secure communication with Braintree's servers
   * @method
   * @name API#braintreeCreateToken
   */
  braintreeCreateToken(parameters: {} = {}): Promise<{}> {
    let path = '/braintree/create-token';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Create Braintree transaction using the payment nonce
   * @method
   * @name API#braintreeCreateTransaction
   */
  braintreeCreateTransaction(
    parameters: {} = {},
    body: {
      amount: number;

      payment_method_nonce: string;

      order_nr: number;

      currency: string;
    },
  ): Promise<{}> {
    let path = '/braintree/create-transaction';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Load guns
   * @method
   * @name API#loadGuns
   */
  loadGuns(
    parameters: {
      goodId?: number;
      manufacturer?: string;
      model?: string;
      barrel?: string;
      caliber?: string;
      magazineCapacity?: number;
      loadFull?: '0' | '1';
      limit?: number;
      offset?: number;
      gunQuery?: string;
    } = {},
  ): Promise<{}> {
    let path = '/guns';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (typeof parameters['goodId'] !== 'undefined') {
      queryParameters['good_id'] = parameters['goodId'];
    }

    queryParameters['good_id'] = this.transformParameter(
      queryParameters['good_id'],
    );

    if (typeof parameters['manufacturer'] !== 'undefined') {
      queryParameters['manufacturer'] = parameters['manufacturer'];
    }

    queryParameters['manufacturer'] = this.transformParameter(
      queryParameters['manufacturer'],
    );

    if (typeof parameters['model'] !== 'undefined') {
      queryParameters['model'] = parameters['model'];
    }

    queryParameters['model'] = this.transformParameter(
      queryParameters['model'],
    );

    if (typeof parameters['barrel'] !== 'undefined') {
      queryParameters['barrel'] = parameters['barrel'];
    }

    queryParameters['barrel'] = this.transformParameter(
      queryParameters['barrel'],
    );

    if (typeof parameters['caliber'] !== 'undefined') {
      queryParameters['caliber'] = parameters['caliber'];
    }

    queryParameters['caliber'] = this.transformParameter(
      queryParameters['caliber'],
    );

    if (typeof parameters['magazineCapacity'] !== 'undefined') {
      queryParameters['magazine_capacity'] = parameters['magazineCapacity'];
    }

    queryParameters['magazine_capacity'] = this.transformParameter(
      queryParameters['magazine_capacity'],
    );

    if (typeof parameters['loadFull'] !== 'undefined') {
      queryParameters['load_full'] = parameters['loadFull'];
    }

    queryParameters['load_full'] = this.transformParameter(
      queryParameters['load_full'],
    );

    queryParameters['limit'] = 10;

    if (typeof parameters['limit'] !== 'undefined') {
      queryParameters['limit'] = parameters['limit'];
    }

    queryParameters['limit'] = this.transformParameter(
      queryParameters['limit'],
    );

    if (typeof parameters['offset'] !== 'undefined') {
      queryParameters['offset'] = parameters['offset'];
    }

    queryParameters['offset'] = this.transformParameter(
      queryParameters['offset'],
    );

    if (typeof parameters['gunQuery'] !== 'undefined') {
      queryParameters['gun_query'] = parameters['gunQuery'];
    }

    queryParameters['gun_query'] = this.transformParameter(
      queryParameters['gun_query'],
    );

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Load equivalent urls from other language versions
   * @method
   * @name API#loadUrlTranslations
   */
  loadUrlTranslations(
    parameters: {
      url: string;
      type: 'product' | 'category' | 'sitemap';
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{
    url_translations: Array<{
      lang_id: string;

      url: string;
    }>;
  }> {
    let path = '/url-translations';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    if (typeof parameters['url'] !== 'undefined') {
      queryParameters['url'] = parameters['url'];
    }

    queryParameters['url'] = this.transformParameter(queryParameters['url']);

    if (typeof parameters['url'] === 'undefined') {
      throw new Error('Missing required parameter: url');
    }

    if (typeof parameters['type'] !== 'undefined') {
      queryParameters['type'] = parameters['type'];
    }

    queryParameters['type'] = this.transformParameter(queryParameters['type']);

    if (typeof parameters['type'] === 'undefined') {
      throw new Error('Missing required parameter: type');
    }

    return this.request(
      'GET',
      `${this.baseUrl}${path}`,
      {},
      headers,
      queryParameters,
    );
  }
  /**
   * Submits contact form
   * @method
   * @name API#contactForm
   */
  contactForm(
    parameters: {} = {},
    body: {
      email?: string;

      message?: string;

      name?: string;

      token?: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{}> {
    let path = '/contact-form';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      body,
      headers,
      queryParameters,
    );
  }
  /**
   * Submits contact form with file
   * @method
   * @name API#contactFormWithFile
   */
  contactFormWithFile(
    parameters: {} = {},
    form: {
      file?: {};

      email?: string;

      message?: string;

      name?: string;

      surname?: string;

      token?: string;
    },
    extraHeaders?: {
      xAcceptLanguage?: string;
    },
  ): Promise<{}> {
    let path = '/contact-form-with-file';
    let headers: Headers = new Headers();
    let queryParameters: QueryParameters = {};

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    if (
      extraHeaders &&
      typeof extraHeaders['xAcceptLanguage'] !== 'undefined'
    ) {
      headers.append('X-Accept-Language', extraHeaders['xAcceptLanguage']!);
    }

    return this.request(
      'POST',
      `${this.baseUrl}${path}`,
      form,
      headers,
      queryParameters,
    );
  }
}

export default new API();
export { API };
