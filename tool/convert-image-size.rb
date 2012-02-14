require 'rubygems'
require 'RMagick'

image_dir = 'image/'
size = 512

Dir::entries(image_dir).each do |filename|
  next if filename == '.' || filename == '..'

  orig = Magick::Image.read(image_dir + filename).first

  width = orig.columns
  height = orig.rows

  # size = width > height ? width : height

  orig.background_color = 'white'
  image = orig.extent(size, size, (size-width)/2, (size-height)/2)

  image.write(image_dir + 'r_' + filename)
end
