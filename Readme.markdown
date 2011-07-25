Interactive Build Template
==========================

This is a basic template for interactive projects, it provides a set of tools of automatically minifiying, compressing and packaing HTML interactive projects for deployment. It uses a Rakefile, which requires Ruby as well as the Rake gem. These come standard on all OSX and most Linux systems. It has no other external dependencies.

Instructions
------------

Inside the project run `rake -T` for a list of possible commands. 

Inside your index.html specify your script and css files as normal, but wrap them in the comment tags below. These are used to identify the files for minification and preserve their order through the minification process.

```
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <!-- JS_START -->
        <script src='js/test.js' type="text/javascript"></script>
        <script src="js/test2.js" type="text/javascript"></script>
        <script src="js/test3.js" type="text/javascript"></script>
        <!-- JS_END -->
        <!-- CSS_START -->
        <link rel="stylesheet" href="css/test.css" />
        <link rel="stylesheet" href="css/test2.css" />
        <link rel="stylesheet" href="css/test3.css" />
        <!-- CSS_END -->
        
        
        <link rel="shortcut icon" href="/favicon.ico">
```


The process is tollerant of whether double or single quotation marks are used. Any tags with a src or href property inside those comment tags will be picked up. If either block is omitted you'll get yelled at but things will run fine. If either block contains references to files that aren't present you'll get yelled at but things will run file. If you do something inadvisable like not including the closing comment tag things may dramatically spanner out.
