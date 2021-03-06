<?php

/**
 * Override or insert variables into the maintenance page template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function mytimes_preprocess_maintenance_page(&$vars) {
  // When a variable is manipulated or added in preprocess_html or
  // preprocess_page, that same work is probably needed for the maintenance page
  // as well, so we can just re-use those functions to do that work here.
  // mytimes_preprocess_html($vars);
  // mytimes_preprocess_page($vars);

  // This preprocessor will also be used if the db is inactive. To ensure your
  // theme is used, add the following line to your settings.php file:
  // $conf['maintenance_theme'] = 'mytimes';
  // Also, check $vars['db_is_active'] before doing any db queries.
}

/**
 * Implements hook_modernizr_load_alter().
 *
 * @return
 *   An array to be output as yepnope testObjects.
 */
/* -- Delete this line if you want to use this function
function mytimes_modernizr_load_alter(&$load) {

}
function MODULENAME_page_alter() {
  $attributes = array( // Set up an array of attributes inside the tag
    'href' => '//cloud.typography.com/[CUSTOM PATH]/fonts.css',
    'rel' => 'stylesheet',
    'type' => 'text/css',
  );
  drupal_add_html_head_link($attributes);
}

/**
 * Implements hook_preprocess_html()
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_html(&$vars) {

}

/**
 * Override or insert variables into the page template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function mytimes_preprocess_page(&$vars) {
  $attributes = array( // Set up an array of attributes inside the tag
    'href' => '//cloud.typography.com/6164632/733342/css/fonts.css',
    'rel' => 'stylesheet',
    'type' => 'text/css',
  );
  drupal_add_html_head_link($attributes);
}

/**
 * Override or insert variables into the region templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_region(&$vars) {

}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_block(&$vars) {

}
// */

/**
 * Override or insert variables into the entity template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_entity(&$vars) {

}
// */

/**
 * Override or insert variables into the node template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function mytimes_preprocess_node(&$vars) {
  $node = $vars['node'];
  if ($vars['view_mode'] == 'teaser') {
    $vars['theme_hook_suggestions'][] = 'node__' . $node->type . '__teaser';
  }
}
// 

/**
 * Override or insert variables into the field template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("field" in this case.)
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_field(&$vars, $hook) {

}
// */

/**
 * Override or insert variables into the comment template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_comment(&$vars) {
  $comment = $vars['comment'];
}
// */

/**
 * Override or insert variables into the views template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
/* -- Delete this line if you want to use this function
function mytimes_preprocess_views_view(&$vars) {
  $view = $vars['view'];
}
// */


/**
 * Override or insert css on the site.
 *
 * @param $css
 *   An array of all CSS items being requested on the page.
 */
 // -- Delete this line if you want to use this function
// function mytimes_css_alter(&$css) {
// dpm($css);
// }
// 

/**
 * Override or insert javascript on the site.
 *
 * @param $js
 *   An array of all JavaScript being presented on the page.
 */
/* -- Delete this line if you want to use this function
function mytimes_js_alter(&$js) {

}
// */


