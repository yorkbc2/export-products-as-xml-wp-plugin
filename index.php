<?php
/*
Plugin Name: Export products as XML (C) O. Voronkov
Description: (C) O. Voronkov
Version:     0.0.1
Author:      Oleksandr Voronkov
Author URI:  yorkbc2@gmail.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

// Action name: save_payment_options_ay2000

if ( !defined( 'ABSPATH' ) ) exit;



class ExportProductsAsXMLPlugin {
    public function __construct() {
        $this->add_menu_item();
        $this->add_handler();
    }

    public function add_menu_item() {
        add_action('admin_menu', function () {
            add_menu_page('Export as XML', 'Export as XML', 'manage_options', 'export-products-as-xml', array(
                $this, "add_page"
            ));
        });
    }

    public function add_page() {
        $path = plugin_dir_url(__FILE__);
        include_once __DIR__ . '/views/admin.php';
    }

    public function add_handler() {
        add_action('wp_ajax_get_products_as_xml', array($this, 'handler'));

        add_action('wp_ajax_get_products_request_count', array($this, 'handler_request_count'));
    }

    public function handler_request_count() {
        $limit = $_POST['limit'];
        $products_IDs = new WP_Query( array(
            'post_type' => 'product',
            'fields' => 'ids', 
            'posts_per_page' => -1
        ) );
        echo json_encode(array('result' => ceil(sizeof($products_IDs->posts) / $limit)));
        exit();
    }

    public function handler() {
        $limit = $_POST['limit'];
        $page = $_POST['page'];
        $products = wc_get_products(array(
            'limit' => $limit,
            'page' => $page
        ));

        $data = array();

        foreach($products as $product) {
            $fav_image = '';
            $image_ids = $product->get_gallery_attachment_ids();
            $img_urls = array();
            foreach ($image_ids as $id) {
                $img_urls[] = wp_get_attachment_url($id);
            }
            if (isset($img_urls[0])) {
                $fav_image = $img_urls[0];
                unset($img_urls[0]);
            }
            $data[] = array(
                'title' => $product->get_name(),
                'description' => $product->get_description(),
                'link' => get_permalink($product->get_id()),
                'image_link' => $fav_image,
                'additional_image_link' => implode('|', $img_urls),
                'availability' => $product->is_in_stock() ? 1 : 0,
                'price' => $product->get_price(),
                'brand' => $product->get_attribute('pa_brend')
            );
        }

        $xml_data = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><products/>');
        $this->array_to_xml($data,$xml_data);
        header("Content-type: text/xml; charset=utf-8");
        echo($xml_data->asXML());
        exit();
    }

    private function array_to_xml($data, &$xml_data) {
        foreach( $data as $key => $value ) {
            if( is_numeric($key) ){
                $key = 'product'; //dealing with <0/>..<n/> issues
            }
            if( is_array($value) ) {
                $subnode = $xml_data->addChild($key);
                $this->array_to_xml($value, $subnode);
            } else {
                $xml_data->addChild("$key",htmlspecialchars("$value"));
            }
         }
    }
}   
    
$epaxml_plugin = new ExportProductsAsXMLPlugin();
    

?>