function Cell() {
  this.values = [];

  for (var i = 0;i < 9;i ++) {
    this.values.push(i + 1);
  }

  this.setValue = function(v) {
    this.values = [Number(v)];
  }

  this.isKnown = function() {
    return (this.values.length == 1);
  }

  this.getValue = function() {
    if (this.isKnown()) {
      return this.values[0];
    } else {
      return  ' ';
    }
  }

  this.isPossible = function(v) {
    return this.values.indexOf(Number(v)) != -1;
  }

  this.remove = function(v) {
    var possible = this.isPossible(v);

    if (possible) {
      var index = this.values.indexOf(Number(v));
      this.values.splice(index, 1);
    }

    return possible;
  }
}

function Table() {
  this.cells = [];

  for (var i = 0;i < 9;i ++) {
    this.cells.push([]);
    for (var j = 0;j < 9;j ++) {
      this.cells[i].push(new Cell());
    }
  }

  this.setValue = function(i, j, v) {
    this.cells[i][j].setValue(v);
  }

  this.rowCells = function(n) {
    return [...Array(9).keys()].map(function(x) {return [n, x]});
  }

  this.colCells = function(n) {
    return [...Array(9).keys()].map(function(x) {return [x, n]});
  }

  this.sqCells = function(n) {
    var j = 3 * (n % 3);
    var i = n - (n % 3);

    var out = [];

    for (var k = 0;k < 3;k ++) {
      for (var l = 0;l < 3;l ++ ) {
        out.push([i + k, j + l]);
      }
    }

    return out;
  }

  this.findMatch = function(i, adj, match_c, match_v, mark) {
    for (var j = 0;j < 9;j ++) {
      if (adj[i][j] == false || mark[j]) {
        continue;
      }

      if (match_v[j] == -1) {
        match_v[j] = i;
        match_c[i] = j;

        return true;
      }

      mark[j] = true;
      if (this.findMatch(match_v[j], adj, match_c, match_v, mark)) {
        match_c[i] = j;
        match_v[j] = i;
        return true;
      }
    }

    return false;
  }

  this.checkStrongness = function(j0, j, adj, match_v, mark) {
    mark[j] = true;

    if (j == j0) {
      return true;
    }

    var i = match_v[j];
    for (var k = 0;k < 9;k ++) {
      if (adj[i][k] == 0 || mark[k]) {
        continue;
      }

      if (this.checkStrongness(j0, k, adj, match_v, mark)) {
        adj[i][k] = 2;
        return true;
      }
    }

    return false;
  }

  this.trim = function(coords) {
    // adjacency matrix
    adj = [];
    for (var i = 0;i < 9;i ++) {
      adj.push([]);
      for (var j = 0;j < 9;j ++) {
        var x = coords[i][0];
        var y = coords[i][1];
        var c = this.cells[x][y];
        var v = Number(c.isPossible(j + 1));
        adj[i].push(v);
      }
    }

    // finding a matching for given cells
    var match_c = Array(9).fill(-1);
    var match_v = Array(9).fill(-1);

    for (var i = 0;i < 9;i ++) {
      if (match_c[i] > -1) {
        continue;
      }

      var mark = Array(9).fill(false);
      this.findMatch(i, adj, match_c, match_v, mark);
    }

    // eliminating impossible values
    for (var i = 0;i < 9;i ++) {
      adj[i][match_c[i]] = 2;
    }

    var changed = false;
    for (var i = 0;i < 9;i ++) {
      for (var j = 0;j < 9;j ++) {
        if (adj[i][j] == 1) {
          var mark = Array(9).fill(false);
          var strong = this.checkStrongness(match_c[i], j, adj, match_v, mark);

          if (strong) {
            adj[i][j] = 2;
          } else {
            changed = true;
          }
        }
      }
    }

    // updating possible values
    for (var i = 0;i < 9;i ++) {
      var values = [];
      for (var j = 0;j < 9;j ++) {
        if (adj[i][j] == 2) {
          values.push(j + 1);
        }
      }

      var x = coords[i][0];
      var y = coords[i][1];
      this.cells[x][y].values = values;
    }

    return changed;
  }

  this.solve = function() {
    var changed = true
    var iter = 0;
    while (changed) {
      changed = false;
      for(var n = 0;n < 9;n ++) {
        changed = changed | this.trim(this.rowCells(n));
        changed = changed | this.trim(this.colCells(n));
        changed = changed | this.trim(this.sqCells(n));
      }
      console.log('iter = ' + iter);

      iter += 1;

      if (iter == 100) {
        break;
      }
    }
  }

  this.log = function () {
    var hline = '';
    for (var i = 0;i < 2 * 9 + 1;i ++) {
      hline += '-';
    }
    var tbl = '';
    tbl += hline + '\n';
    for (var i = 0;i < 9;i ++) {
      var row = '|';
      for (var j = 0;j < 9;j ++) {
        row += this.cells[i][j].getValue() + '|';
      }
      tbl += row + '\n';
    }
    tbl += hline + '\n';
    console.log(tbl);
  }
}

function getAsTable() {
  var table = new Table();

  for (var i = 0;i < 9;i ++) {
    for (var j = 0;j < 9;j ++) {
      var e = document.getElementById('c' + j + i);
      var v = e.children[0].value;

      if (v != "") {
        table.setValue(i, j, v);
      }
    }
  }

  return table;
}

function fillWith(table) {
  for (var i = 0;i < 9;i ++) {
    for (var j = 0;j < 9;j ++) {
      var e = document.getElementById('c' + j + i).children[0];
      var v = e.value;

      if (v == "" && table.cells[i][j].isKnown()) {
        var nv = table.cells[i][j].getValue();
        e.value = nv;
      }
    }
  }
}

function main() {
  table = getAsTable();
  table.solve();
  table.log();
  fillWith(table);
}

main();
