<div id="export-products-as-xml-wrapper" class="card">
    <h3>
        Экспорт товаров из магазина
    </h3>
    <p>
        Эскпортируйте Ваши товары из магазина по одному клику!
    </p>
    <div class="epax-spinner-wrapper"></div>
    <div class="loading-bar"></div>
    <button class="button" type="button" id="export">
        Экспортировать товары
    </button>
</div>
<script>
window.__GLOBAL_VARIABLES__ = {
    exportUrl: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
    exportRequestsCountUrl: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
    exportAction: 'get_products_as_xml',
    exportRequestsCountAction: 'get_products_request_count'
};
</script>
<link rel="stylesheet" href="<?php echo $path ?>/styles/main.css">
<script src="<?php echo $path ?>/scripts/json2xml.js"></script>
<script src="<?php echo $path ?>/scripts/xml2json.js"></script>
<script src="<?php echo $path ?>/scripts/elements.js"></script>
<script src="<?php echo $path ?>/scripts/store.js"></script>
<script src="<?php echo $path ?>/scripts/main.js"></script>