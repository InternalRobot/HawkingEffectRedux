var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var csv = require('csv')
var lodash = require('lodash')
var Crypto = require('crypto')

module.exports = function(grunt) {

  grunt.registerTask("import_graph_data", "Import graph data", function(){

    var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);

    oauth2Client.setCredentials({
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      expiry_date: process.env.GOOGLE_ACCESS_TOKEN_EXPIRES
    })

    var done = this.async();

    var drive = google.drive({version: "v2", auth: oauth2Client})

    drive.files.get({fileId: process.env.GOOGLE_DOCUMENT_KEY}, function(e, r){ 

      if (e) {done(false)};

      var uri = r.exportLinks['text/csv']

      oauth2Client.request({uri: uri}, function(e, r){
        if (e) {done(false)};

        csv.parse(r, {columns: true}, function(e, d){
          if (e) {done(false)};

          var data = assemble_graph_data(d);

          var shareables = assemble_shareables(d);


          grunt.file.write("./app/data.json", JSON.stringify(data));
          grunt.file.write('./app/shareables.json', JSON.stringify(shareables));
          grunt.file.write("./app/scripts/data.js", 'define([], function() {return ' + JSON.stringify(data) + ';});');

          done();
        })
      })
    })
  })
}

function assemble_shareables(rows) {
  return extractPaths(rows)
}

function extractPaths(array) {
  var index = {};

  for (var ni = 0; ni < array.length; ni++) {
    var node = array[ni];

    // Initialize this node in the index, whether or not it will come up later.
    if (!(node.slug in index)) {
      index[node.slug] = {
        node: node,
        children: []
      }
    }

    var parents = node.strong_parents.split(",")
    
    for (var pi = 0; pi < parents.length; pi++) {
      var parent = parents[pi];

      if (parent in index) {
        index[parent].children.push(node);
      } else {
        var parentNode = lodash.find(array, function(e){ return e.slug == parent; })

        index[parent] = {
          node: parentNode,
          children: [node]
        }

      }
    };
  };

  var paths = [];

  function _insert(slug, thisPath, paths, index) {
    // thisPath.push(index[slug].connection)
    var indexedNode = index[slug];

    if (!(typeof(indexedNode) == "object")) { 
      console.log("Tree index entry missing for", slug);
      return
    };

    thisPath.push(indexedNode.node.connection);

    var hash = Crypto.createHash("sha1")

    for (var key in indexedNode.node) {
      hash.update(indexedNode.node[key]);
    }

    for (var pi = 0; pi < thisPath.length; pi++) {
      hash.update(thisPath[pi]);
    };

    paths.push({
      path: thisPath,
      hash: hash.digest('hex'),
      name: indexedNode.node.connection,
      id: indexedNode.node.slug,
      description: indexedNode.node.description,
      shareable: !indexedNode.node.no_share.length,
      type: indexedNode.node.type
    })

    for (var ci = 0; ci < indexedNode.children.length; ci++) {
      var child = indexedNode.children[ci]

      _insert(child.slug, thisPath.slice(), paths, index)
    };

  }

  _insert("stephen_hawking", [], paths, index);

  return paths;
}


function assemble_graph_data(rows) {

  var data = {
    nodes: [],
    strong_links: [],
    weak_links: []
  };

  var node_positions = {}

  for (var di = 0; di < rows.length; di++) {
    var row = rows[di]
    if (row.exclude.length) { console.log("Excluding", row.connection); continue } // excluded row
    if (!row.connection.length) { continue } // blank row?

    data.nodes.push(row)
    current_node_index = data.nodes.length - 1

    // Index the position of this node for later reference
    // It might not be the iterator di, since we can skip 
    // this step by excluding the row or if it's blank.
    node_positions[row.slug] = current_node_index
    
    var link_types = ['weak', 'strong'];

    for (var li = 0; li < link_types.length; li++) {
      var link_type = link_types[li];

      // Discover and insert strong_parents links
      var parents = row[link_type + "_parents"].split(",")
      for (var pi = 0; pi < parents.length; pi++) {
        var parent = parents[pi]

        // Because splitting an empty string returns an array containing an empty string, because Javascript....
        // http://www.andrewkreps.com/sites/default/files/styles/work_large/public/db_vader-300.dpi_.jpg
        if (parent == '') { continue };

        if (node_positions[parent]) {
          // We have found the parent in our index; use its position
          data[link_type + "_links"].push({source: current_node_index, target: node_positions[parent]})
        } else {
          // We have not found the parent in our index; find the parent in nodes, then index its position
          var target = lodash.findIndex(data.nodes, function(row){ return row.slug == parent })
          
          if (target >= 0) {
            // What a tragety this next line is.
            node_positions[rows[target]] = target 

            data[link_type + "_links"].push({source: current_node_index, target: target})
          } else {
            console.log("No connecting node found for", parent, "from", row.connection)
          }
        };
      };              
    };


  };
  return data;
}