  </div>
  <footer>
    <?php echo anchor('/', 'Home', 'title=home');?>
    <?php echo anchor('/job', 'Jobs', 'title=jobs');?>
    <?php echo anchor('/job/add', 'New', 'title=new');?>
    <?php echo anchor('/auth/logout/', 'Logout', 'title=logout');?>
  </footer>
</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
<script>!window.jQuery && document.write(unescape('%3Cscript src=<?php echo base_url()."public/js/libs/jquery-1.5.1.min.js";?>%3E%3C/script%3E'))</script>
<script src=<?php echo base_url()."public/js/plugins.js";?>></script>
<script src=<?php echo base_url()."public/js/script.js";?>></script>
<!--[if lt IE 7 ]>
<script src=<?php echo base_url()."public/js/libs/dd_belatedpng.js";?>></script>
<script> DD_belatedPNG.fix('img, .png_bg');</script>
<![endif]-->
</body>
</html>