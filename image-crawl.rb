# :coding : UTF-8

require 'net/http'
require 'rexml/document'
require 'open-uri'

host = 'api.rakuten.co.jp'
url = '/rws/3.0/rest?developerId=c7e107a4bd63d7ea15966c2bdaef7f75&operation=ItemSearch&version=2010-09-15&keyword=%E7%A6%8F%E8%A2%8B&sort=%2BitemPrice'

Net::HTTP.start(host, 80) do |http|
  response = http.get(url).body

  response.gsub!(/xmlns:/, '')
  response.gsub!(/header:Header/, 'Header')
  response.gsub!(/itemSearch:ItemSearch/, 'ItemSearch')

  xml = REXML::Document.new(response)

  count = 0
  xml.elements.each('Response/Body/ItemSearch/Items/Item/mediumImageUrl') do |elem|

    count += 1

    image_url = elem.text
    puts image_url

    image_url.sub!(/\?.*/, '')

    filename = File.basename(image_url)
    
    image_url += '?_ex=512x512'

    puts image_url

    # filename.sub!(/\?.*/, '')
    filename.sub!(/.*\./, '.')
    filename = 'image/' + count.to_s + filename
    puts filename

    open(filename, 'wb') do |file|
      open(image_url) do |data|
        file.write(data.read)
      end
    end

  end

end



