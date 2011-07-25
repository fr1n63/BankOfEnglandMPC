require 'fileutils'
STDOUT.sync = true #ensures console output is realtime, not buffered

desc "Build a new distribution zipfile for this project"
task :build do
  Builder.setup_tmp
  Builder.build_js
  Builder.build_css
  Builder.process_html
  Builder.zip
end

desc "Decouple this project from the project_template git repository ready for use in a new project"
task :decouple do
  ROOT = File.dirname(__FILE__)
  `rm -rf #{File.join(ROOT, '.git')}`
  
  `rm -rf #{File.join(ROOT, 'bin-tmp')}`
  `rm -rf #{File.join(ROOT, 'bin-dist')}`
  
  FileUtils.mkdir_p(File.join(ROOT, 'bin-tmp'))
  FileUtils.mkdir_p(File.join(ROOT, 'bin-dist'))
  
  `cp .gitignore bin-tmp/`
  `cp .gitignore bin-dist/`
end

module Builder
  ROOT = File.dirname(__FILE__)
  COMPILER_VERSION = 964
  COMPRESSOR_VERSION =  '2.4.6'
  JS_REGEXP = /<!-- JS_START -->(.*)<!-- JS_END -->/m
  JS_FILES_REGEXP = /src=["|'](.*?)['|"]/
  CSS_REGEXP = /<!-- CSS_START -->(.*)<!-- CSS_END -->/m
  CSS_FILES_REGEXP = /href=["|'](.*?)["|']/

  def self.build_js
    js_files = self.get_js_files
    unless js_files
      puts "WARN: No JS block found in index.html or no JS files found"
      return
    end
    puts "LOG : JS Files: #{js_files.join(', ')}"
    js_files = js_files.map do |file| 
      "--js=#{ROOT}/#{file} "
    end.join
    output = "--js_output_file=#{ROOT}/bin-tmp/js/project.js"
    `java -jar #{ROOT}/support/compiler-#{COMPILER_VERSION}.jar #{js_files} #{output}`
    puts "LOG : JS Compiled"
  end

  def self.get_js_files
    js_block = JS_REGEXP.match(self.get_html)
    return false if js_block.nil?

    js_files = js_block[0].scan(JS_FILES_REGEXP).to_a.flatten
    
    js_files = self.confirm_exist(js_files)
    return false unless js_files.any?
    js_files
  end

  def self.get_html
    return @@html if defined? @@html
    @@html = File.readlines(File.join(ROOT, 'src/index.html')).join(' ')
  end

  def self.build_css
    css_files = self.get_css_files
    unless css_files
      puts "WARN: No CSS block found in index.html or no CSS files found"
      return
    end
    puts "LOG : CSS Files: #{css_files.join(', ')}"
    css = ""
    css_files.each do |file|
      yui = IO.popen("java -jar #{ROOT}/support/yuicompressor-#{COMPRESSOR_VERSION}.jar --type css ", "w+")
      yui.puts IO.read(file)
      yui.close_write
      css += yui.gets
    end
    css_file = File.open(File.join(ROOT, 'bin-tmp', 'css', 'project.css'), 'w')
    css_file.puts css
    css_file.close
    puts "LOG : CSS Compiled"
  end

  def self.get_css_files
    css_block = CSS_REGEXP.match(self.get_html)
    return false if css_block.nil?

    css_files = css_block[0].scan(CSS_FILES_REGEXP).to_a.flatten
    
    css_files = self.confirm_exist(css_files)
    return false unless css_files.any?
    css_files
  end

  def self.confirm_exist(files)
    files = files.map do |file|
      file = "src/" + file
      unless File.exists?(file)
        puts "WARN: #{file} specified but could not be found"
        nil
      else
        file
      end
    end.compact
    files
  end

  def self.process_html
    html = self.get_html
    html.gsub!(JS_REGEXP, "<script type='text/javascript' src='js/project.js'></script>")
    html.gsub!(CSS_REGEXP, "<link rel='stylesheet' href='css/project.css' />")
    File.open(File.join(ROOT, 'bin-tmp', 'index.html'), 'w') do |file|
      file.puts html
    end
  end

  def self.zip
    stamp = Time.now.strftime("%d%m%Y-%H%M")
    `cd bin-tmp && zip -r ../bin-dist/project-#{stamp}.zip * -x "?*/.?*"`
  end

  def self.clean_up
    `rm -rf #{File.join(ROOT, 'bin-tmp')}`
  end
  
  def self.setup_tmp
    self.clean_up
    
    FileUtils.mkdir_p(File.join(ROOT, 'bin-tmp'))
    
    `cp -r src/ bin-tmp/`
    
    `rm -rf #{File.join(ROOT, 'bin-tmp', 'js')}`
    `rm -rf #{File.join(ROOT, 'bin-tmp', 'css')}`
    
    FileUtils.mkdir_p(File.join(ROOT, 'bin-tmp', 'js'))
    FileUtils.mkdir_p(File.join(ROOT, 'bin-tmp', 'css'))
    
  end

end
