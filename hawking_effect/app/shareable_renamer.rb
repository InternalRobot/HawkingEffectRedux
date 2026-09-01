require 'json'
require 'logger'

logger = Logger.new(STDOUT)
if $DEBUG
  logger.level = Logger::DEBUG
else
  logger.level = Logger::INFO
end

shareables = JSON.parse(File.read("./shareables.json"))

index = shareables.each_with_object({}) do |row, hash|
  hash[row['hash']] = row
end

paths = Dir["/Users/mattwebster/Desktop/images/*.jpg"]

paths.each do |path|
  path.match(/[a-zA-Z0-9]{40}/)
  
  unless hash = $&
    logger.debug "No hash found for #{path}"
    next
  end

  slug = index[hash] && index[hash]['id']

  unless slug
    logger.warn "No slug found for path #{path}"
    next
  end

  File.open(path.sub(hash, slug), "w+") do |file|
    logger.debug "Writing #{path.sub(hash, slug)}"
    file.write File.open(path, "r").read
  end
end