# :coding : UTF-8

require 'net/http'
require 'rexml/document'
require 'open-uri'

host = 'api.rakuten.co.jp'
url_base = '/rws/3.0/rest'
option = {
  developerId: 'c7e107a4bd63d7ea15966c2bdaef7f75',
  operation: 'ItemSearch',
  version: '2010-09-15',
  keyword: '%E7%A6%8F%E8%A2%8B',
}

count = 0

Net::HTTP.start(host, 80) do |http|

  for i in 1...10
    
    url = url_base + '?' + option.to_a.map{|a| a[0].to_s+'='+a[1] }.join('&') + '&page=' + i.to_s
    puts url

    response = http.get(url).body

    response.gsub!(/xmlns:/, '')
    response.gsub!(/header:Header/, 'Header')
    response.gsub!(/itemSearch:ItemSearch/, 'ItemSearch')

    xml = REXML::Document.new(response)

    xml.elements.each('Response/Body/ItemSearch/Items/Item/mediumImageUrl') do |elem|

      count += 1

      if count % 5 == 0
        sleep 1
      end

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
end
