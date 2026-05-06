import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiAffiliateAffiliate extends Schema.CollectionType {
  collectionName: 'affiliates';
  info: {
    displayName: 'Affiliate';
    pluralName: 'affiliates';
    singularName: 'affiliate';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::affiliate.affiliate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    enabled: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    revenueSplitAffiliatePct: Attribute.Float;
    revenueSplitDaoPct: Attribute.Float;
    revenueSplitTraderPct: Attribute.Float;
    rewardAmount: Attribute.Float;
    signedMessage: Attribute.Text;
    timeCapDays: Attribute.Integer;
    triggerVolume: Attribute.Float;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::affiliate.affiliate',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    volumeCap: Attribute.Float;
    walletAddress: Attribute.String & Attribute.Required & Attribute.Unique;
  };
}

export interface ApiAnnouncementAnnouncement extends Schema.CollectionType {
  collectionName: 'announcements';
  info: {
    displayName: 'Announcement';
    pluralName: 'announcements';
    singularName: 'announcement';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::announcement.announcement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    environments: Attribute.Relation<
      'api::announcement.announcement',
      'oneToMany',
      'api::environment.environment'
    >;
    isCritical: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    networks: Attribute.Relation<
      'api::announcement.announcement',
      'oneToMany',
      'api::network.network'
    >;
    text: Attribute.Text & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::announcement.announcement',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    description: 'Create your blog content';
    displayName: 'Article';
    pluralName: 'articles';
    singularName: 'article';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    authorsBio: Attribute.Relation<
      'api::article.article',
      'manyToOne',
      'api::author.author'
    >;
    blocks: Attribute.DynamicZone<
      [
        'shared.media',
        'shared.quote',
        'shared.rich-text',
        'shared.slider',
        'shared.video-embed'
      ]
    >;
    categories: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::category.category'
    >;
    cover: Attribute.Media<'images' | 'files' | 'videos'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 256;
      }>;
    featured: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    publishDate: Attribute.DateTime;
    publishDateVisible: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    publishedAt: Attribute.DateTime;
    seo: Attribute.Component<'shared.seo'>;
    slug: Attribute.UID<'api::article.article', 'title'>;
    tags: Attribute.Relation<
      'api::article.article',
      'manyToMany',
      'api::tag.tag'
    >;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAuthorAuthor extends Schema.CollectionType {
  collectionName: 'authors';
  info: {
    description: 'Create authors for your content';
    displayName: 'Author';
    pluralName: 'authors';
    singularName: 'author';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Attribute.Relation<
      'api::author.author',
      'oneToMany',
      'api::article.article'
    >;
    avatar: Attribute.Media<'images'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::author.author',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.String;
    name: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::author.author',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBondingPoolBondingPool extends Schema.CollectionType {
  collectionName: 'bonding_pools';
  info: {
    displayName: 'Bonding Pool';
    pluralName: 'bonding-pools';
    singularName: 'bonding-pool';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::bonding-pool.bonding-pool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    solver_bonding_pools: Attribute.Relation<
      'api::bonding-pool.bonding-pool',
      'oneToMany',
      'api::solver-bonding-pool.solver-bonding-pool'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::bonding-pool.bonding-pool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCategoryCategory extends Schema.CollectionType {
  collectionName: 'categories';
  info: {
    description: 'Organize your content into categories';
    displayName: 'Category';
    pluralName: 'categories';
    singularName: 'category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Attribute.Relation<
      'api::category.category',
      'manyToMany',
      'api::article.article'
    >;
    backgroundColor: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text & Attribute.Required;
    image: Attribute.Media<'images'>;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID & Attribute.Required;
    textColor: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::category.category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCorrelatedTokenCorrelatedToken
  extends Schema.CollectionType {
  collectionName: 'correlated_tokens';
  info: {
    displayName: 'Correlated Tokens';
    pluralName: 'correlated-tokens';
    singularName: 'correlated-token';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::correlated-token.correlated-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    network: Attribute.Relation<
      'api::correlated-token.correlated-token',
      'oneToOne',
      'api::network.network'
    >;
    tokens: Attribute.JSON;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::correlated-token.correlated-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEnvironmentEnvironment extends Schema.CollectionType {
  collectionName: 'environments';
  info: {
    displayName: 'Environment';
    pluralName: 'environments';
    singularName: 'environment';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::environment.environment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::environment.environment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFaqCategoryFaqCategory extends Schema.CollectionType {
  collectionName: 'faq_categories';
  info: {
    displayName: 'FAQ Category';
    pluralName: 'faq-categories';
    singularName: 'faq-category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::faq-category.faq-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Text & Attribute.Required;
    image: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::faq-category.faq-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFaqQuestionFaqQuestion extends Schema.CollectionType {
  collectionName: 'faq_questions';
  info: {
    description: '';
    displayName: 'FAQ question';
    pluralName: 'faq-questions';
    singularName: 'faq-question';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Answer: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::faq-question.faq-question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    faq_category: Attribute.Relation<
      'api::faq-question.faq-question',
      'oneToOne',
      'api::faq-category.faq-category'
    >;
    publishedAt: Attribute.DateTime;
    Question: Attribute.String;
    slug: Attribute.UID;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::faq-question.faq-question',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiGlobalGlobal extends Schema.SingleType {
  collectionName: 'globals';
  info: {
    description: '';
    displayName: 'Global';
    name: 'global';
    pluralName: 'globals';
    singularName: 'global';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    favicon: Attribute.Media<'images'> &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    footer: Attribute.Component<'layout.footer'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::global.global',
      'oneToMany',
      'api::global.global'
    >;
    metadata: Attribute.Component<'meta.metadata'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    navbar: Attribute.Component<'layout.navbar'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    notificationBanner: Attribute.Component<'elements.notification-banner'> &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::global.global',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLeadFormSubmissionLeadFormSubmission
  extends Schema.CollectionType {
  collectionName: 'lead_form_submissions';
  info: {
    description: '';
    displayName: 'Lead form submission';
    name: 'lead-form-submission';
    pluralName: 'lead-form-submissions';
    singularName: 'lead-form-submission';
  };
  options: {
    draftAndPublish: false;
    increments: true;
    timestamps: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::lead-form-submission.lead-form-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.String;
    status: Attribute.Enumeration<['seen', 'contacted', 'ignored']>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::lead-form-submission.lead-form-submission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNetworkNetwork extends Schema.CollectionType {
  collectionName: 'networks';
  info: {
    description: '';
    displayName: 'Network';
    pluralName: 'networks';
    singularName: 'network';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    chainId: Attribute.Integer;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::network.network',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    solver_networks: Attribute.Relation<
      'api::network.network',
      'oneToMany',
      'api::solver-network.solver-network'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::network.network',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotificationTemplateNotificationTemplate
  extends Schema.CollectionType {
  collectionName: 'notification_templates';
  info: {
    description: '';
    displayName: 'Notification template';
    pluralName: 'notification-templates';
    singularName: 'notification-template';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification-template.notification-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.RichText & Attribute.Required;
    dueDate: Attribute.DateTime;
    location: Attribute.Enumeration<['default', 'speechBubble']> &
      Attribute.DefaultTo<'default'>;
    push: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    thumbnail: Attribute.Media<'images'>;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::notification-template.notification-template',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String;
  };
}

export interface ApiNotificationNotification extends Schema.CollectionType {
  collectionName: 'notifications';
  info: {
    description: '';
    displayName: 'Notification';
    pluralName: 'notifications';
    singularName: 'notification';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    data: Attribute.JSON;
    notification_template: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'api::notification-template.notification-template'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::notification.notification',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotificationsConsumerNotificationsConsumer
  extends Schema.SingleType {
  collectionName: 'notifications_consumers';
  info: {
    displayName: 'NotificationsConsumer';
    pluralName: 'notifications-consumers';
    singularName: 'notifications-consumer';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notifications-consumer.notifications-consumer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    lastConsumedNotificationDate: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::notifications-consumer.notifications-consumer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPagePage extends Schema.CollectionType {
  collectionName: 'pages';
  info: {
    description: '';
    displayName: 'Page';
    name: 'page';
    pluralName: 'pages';
    singularName: 'page';
  };
  options: {
    draftAndPublish: true;
    increments: true;
    timestamps: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    contentSections: Attribute.DynamicZone<
      [
        'sections.hero',
        'sections.bottom-actions',
        'sections.feature-columns-group',
        'sections.feature-rows-group',
        'sections.testimonials-group',
        'sections.large-video',
        'sections.rich-text',
        'sections.pricing',
        'sections.lead-form',
        'sections.features',
        'sections.heading'
      ]
    > &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heading: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Attribute.String;
    localizations: Attribute.Relation<
      'api::page.page',
      'oneToMany',
      'api::page.page'
    >;
    metadata: Attribute.Component<'meta.metadata'> &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Attribute.DateTime;
    shortName: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::page.page', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiProductFeatureProductFeature extends Schema.CollectionType {
  collectionName: 'product_features';
  info: {
    description: '';
    displayName: 'Product Feature';
    pluralName: 'product-features';
    singularName: 'product-feature';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-feature.product-feature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-feature.product-feature',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRestrictedTokenListRestrictedTokenList
  extends Schema.CollectionType {
  collectionName: 'restricted_token_lists';
  info: {
    displayName: 'Restricted Token List';
    pluralName: 'restricted-token-lists';
    singularName: 'restricted-token-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::restricted-token-list.restricted-token-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    restrictedCountries: Attribute.JSON & Attribute.Required;
    tokenListUrl: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::restricted-token-list.restricted-token-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSolverBondingPoolSolverBondingPool
  extends Schema.CollectionType {
  collectionName: 'solver_bonding_pools';
  info: {
    description: '';
    displayName: 'Solver Bonding Pool';
    pluralName: 'solver-bonding-pools';
    singularName: 'solver-bonding-pool';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::solver-bonding-pool.solver-bonding-pool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    isReducedBondingPool: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    joinedOn: Attribute.DateTime & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    solver_networks: Attribute.Relation<
      'api::solver-bonding-pool.solver-bonding-pool',
      'oneToMany',
      'api::solver-network.solver-network'
    >;
    solvers: Attribute.Relation<
      'api::solver-bonding-pool.solver-bonding-pool',
      'manyToMany',
      'api::solver.solver'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::solver-bonding-pool.solver-bonding-pool',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSolverNetworkSolverNetwork extends Schema.CollectionType {
  collectionName: 'solver_networks';
  info: {
    description: '';
    displayName: 'Solver Network';
    pluralName: 'solver-networks';
    singularName: 'solver-network';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    address: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::solver-network.solver-network',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    environment: Attribute.Relation<
      'api::solver-network.solver-network',
      'oneToOne',
      'api::environment.environment'
    > &
      Attribute.Required;
    isColocated: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    isVouched: Attribute.Boolean & Attribute.DefaultTo<false>;
    isWhiteListed: Attribute.Boolean & Attribute.DefaultTo<false>;
    network: Attribute.Relation<
      'api::solver-network.solver-network',
      'manyToOne',
      'api::network.network'
    > &
      Attribute.Required;
    payoutAddress: Attribute.String;
    solver: Attribute.Relation<
      'api::solver-network.solver-network',
      'manyToOne',
      'api::solver.solver'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::solver-network.solver-network',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    vouchedBy: Attribute.Relation<
      'api::solver-network.solver-network',
      'manyToOne',
      'api::solver-bonding-pool.solver-bonding-pool'
    >;
  };
}

export interface ApiSolverSolver extends Schema.CollectionType {
  collectionName: 'solvers';
  info: {
    description: '';
    displayName: 'Solver';
    pluralName: 'solvers';
    singularName: 'solver';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    activeNetworks: Attribute.JSON;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::solver.solver',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    displayName: Attribute.String & Attribute.Required;
    hasActiveNetworks: Attribute.Boolean & Attribute.DefaultTo<false>;
    image: Attribute.Media<'images'>;
    isColocated: Attribute.Enumeration<['Yes', 'No', 'Partial']> &
      Attribute.Required &
      Attribute.DefaultTo<'No'>;
    isServiceFeeEnabled: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    organization: Attribute.String;
    solver_bonding_pools: Attribute.Relation<
      'api::solver.solver',
      'manyToMany',
      'api::solver-bonding-pool.solver-bonding-pool'
    >;
    solver_networks: Attribute.Relation<
      'api::solver.solver',
      'oneToMany',
      'api::solver-network.solver-network'
    >;
    solverId: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::solver.solver',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    website: Attribute.String;
  };
}

export interface ApiTagTag extends Schema.CollectionType {
  collectionName: 'tags';
  info: {
    description: 'Organize your content using Tags';
    displayName: 'Tag';
    pluralName: 'tags';
    singularName: 'tag';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    articles: Attribute.Relation<
      'api::tag.tag',
      'manyToMany',
      'api::article.article'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    name: Attribute.UID & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::tag.tag', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTelegramSubscriptionTelegramSubscription
  extends Schema.CollectionType {
  collectionName: 'telegram_subscriptions';
  info: {
    description: '';
    displayName: 'Telegram subscription';
    pluralName: 'telegram-subscriptions';
    singularName: 'telegram-subscription';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Attribute.String & Attribute.Required;
    authDate: Attribute.BigInteger;
    chatId: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::telegram-subscription.telegram-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    firstName: Attribute.String;
    hash: Attribute.String;
    photoUrl: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::telegram-subscription.telegram-subscription',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::affiliate.affiliate': ApiAffiliateAffiliate;
      'api::announcement.announcement': ApiAnnouncementAnnouncement;
      'api::article.article': ApiArticleArticle;
      'api::author.author': ApiAuthorAuthor;
      'api::bonding-pool.bonding-pool': ApiBondingPoolBondingPool;
      'api::category.category': ApiCategoryCategory;
      'api::correlated-token.correlated-token': ApiCorrelatedTokenCorrelatedToken;
      'api::environment.environment': ApiEnvironmentEnvironment;
      'api::faq-category.faq-category': ApiFaqCategoryFaqCategory;
      'api::faq-question.faq-question': ApiFaqQuestionFaqQuestion;
      'api::global.global': ApiGlobalGlobal;
      'api::lead-form-submission.lead-form-submission': ApiLeadFormSubmissionLeadFormSubmission;
      'api::network.network': ApiNetworkNetwork;
      'api::notification-template.notification-template': ApiNotificationTemplateNotificationTemplate;
      'api::notification.notification': ApiNotificationNotification;
      'api::notifications-consumer.notifications-consumer': ApiNotificationsConsumerNotificationsConsumer;
      'api::page.page': ApiPagePage;
      'api::product-feature.product-feature': ApiProductFeatureProductFeature;
      'api::restricted-token-list.restricted-token-list': ApiRestrictedTokenListRestrictedTokenList;
      'api::solver-bonding-pool.solver-bonding-pool': ApiSolverBondingPoolSolverBondingPool;
      'api::solver-network.solver-network': ApiSolverNetworkSolverNetwork;
      'api::solver.solver': ApiSolverSolver;
      'api::tag.tag': ApiTagTag;
      'api::telegram-subscription.telegram-subscription': ApiTelegramSubscriptionTelegramSubscription;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
