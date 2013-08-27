var assert = require("assert");
var Lib = require("./../ramda");

describe('project', function() {
    var project = Lib.project;
    var kids = [
        {name: 'Abby', age: 7, hair: 'blond'},
        {name: 'Fred', age: 12, hair: 'brown'},
        {name: 'Rusty', age: 10, hair: 'brown'},
        {name: 'Alois', age: 15, disposition: 'surly'}
    ];

    it('should select the chosen properties from each element in a list', function() {
        assert.deepEqual(project(['name', 'age'], kids), [
            {name: 'Abby', age: 7},
            {name: 'Fred', age: 12},
            {name: 'Rusty', age: 10},
            {name: 'Alois', age: 15}
        ]);
    });

    it('should have an undefined property on the output tuple for any input tuple that does not have the property', function() {
        assert.deepEqual(project(["name", "hair"], kids), [
            {name: 'Abby', hair: 'blond'},
            {name: 'Fred', hair: 'brown'},
            {name: 'Rusty', hair: 'brown'},
            {name: 'Alois', hair: undefined}
        ]);
    });

    it.skip('should be aliased by `select`', function() {
        assert.deepEqual(Lib.select(['name', 'age'], kids), [{name: 'Abby', age: 7}, {name: 'Fred', age: 12}]);
        assert.strictEqual(Lib.select, project);
    });

    it('should be automatically curried', function() {
        var myFields = project(['name', 'age']);
        assert.deepEqual(myFields(kids), [
            {name: 'Abby', age: 7},
            {name: 'Fred', age: 12},
            {name: 'Rusty', age: 10},
            {name: 'Alois', age: 15}
        ]);
    });
    
});


describe('union', function() {
    var union = Lib.union;
    var R = [1,2,3,4];
    var S = [3,4,5,6];
    var Ro = [{a: 1},{a: 2},{a: 3},{a: 4}];
    var So = [{a: 3},{a: 4},{a: 5},{a: 6}];
    it("combines two lists into the set of all their elements", function() {
        assert.deepEqual(union(R, S), [1,2,3,4,5,6]);
    });
   
    it("does not work for non-primitives (use `unionWith`)", function() {
        assert.equal(union(Ro, So).length, 8);
    });
});

describe('unionWith', function() {
    var unionWith = Lib.unionWith;
    var Ro = [{a: 1},{a: 2},{a: 3},{a: 4}];
    var So = [{a: 3},{a: 4},{a: 5},{a: 6}];
    var eqA = function(r, s) { return r.a === s.a; };
    it.skip("combines two lists into the set of all their elements based on the passed-in equality predicate", function() {
        assert.deepEqual(unionWith(eqA, Ro, So), [{a: 1},{a: 2},{a: 3},{a: 4},{a: 5},{a: 6}]);
    });
   
});

(function() {
    var albums = [
        {title: 'Art of the Fugue', artist: 'Glenn Gould', genre: 'Baroque'},
        {title: 'A Farewell to Kings', artist: 'Rush', genre: 'Rock'},
        {title: 'Timeout', artist: 'Dave Brubeck Quartet', genre: 'Jazz'},
        {title: 'Fly By Night', artist: 'Rush', genre: 'Rock'},
        {title: 'Goldberg Variations', artist: 'Daniel Barenboim', genre: 'Baroque'},
        {title: 'New World Symphony', artist: 'Leonard Bernstein', genre: 'Romantic'},
        {title: 'Romance with the Unseen', artist: 'Don Byron', genre: 'Jazz'},
        {title: 'Somewhere In Time', artist: 'Iron Maiden', genre: 'Metal'},
        {title: 'In Times of Desparation', artist: 'Danny Holt', genre: 'Modern'},
        {title: 'Evita', artist: 'Various', genre: 'Broadway'},
        {title: 'Five Leaves Left', artist: 'Nick Drake', genre: 'Folk'},
        {title: 'The Magic Flute', artist: 'John Eliot Gardiner', genre: 'Classical'}
    ];
    var prop = Lib.prop;
    var derivedGenre = (function() {
        var remap = {
            Baroque: 'Classical',
            Modern: 'Classical',
            Romantic: 'Classical',
            Metal: 'Rock'  /*, etc */
        };
        return function(album) {
            var genre = prop("genre", album);
            return remap[genre] || genre;
        };
    }());

    describe('sortBy', function() {
        var sortBy = Lib.sortBy;

        it('should sort by a simple property of the objects', function() {
            var sortedAlbums = sortBy(prop("title"), albums);
            assert.equal(sortedAlbums.length, albums.length);
            assert.equal(sortedAlbums[0].title, "A Farewell to Kings");
            assert.equal(sortedAlbums[11].title, "Timeout");
        });

        it('should be automatically curried', function() {
            var sorter = sortBy(prop("title"));
            var sortedAlbums = sorter(albums);
            assert.equal(sortedAlbums.length, albums.length);
            assert.equal(sortedAlbums[0].title, "A Farewell to Kings");
            assert.equal(sortedAlbums[11].title, "Timeout");
        });
    });
    describe('countBy', function() {
        var countBy = Lib.countBy;

        it('should count by a simple property of the objects', function() {
            assert.deepEqual(countBy(prop("genre"), albums), {
                Baroque: 2, Rock: 2, Jazz: 2, Romantic: 1, Metal: 1, Modern: 1, Broadway: 1, Folk: 1, Classical: 1
            });
        });

        it('should count by a more complex function on the objects', function() {
            assert.deepEqual(countBy(derivedGenre, albums), {
                Classical: 5, Rock: 3, Jazz: 2, Broadway: 1, Folk: 1
            });
        });

        it('should be automatically curried', function() {
            var counter = countBy(prop("genre"));
            assert.deepEqual(counter(albums), {
                Baroque: 2, Rock: 2, Jazz: 2, Romantic: 1, Metal: 1, Modern: 1, Broadway: 1, Folk: 1, Classical: 1
            });
        });
    });

    describe('groupBy', function() {
        var groupBy = Lib.groupBy;
        it('should group by a simple property of the objects', function() {
            assert.deepEqual(groupBy(prop("genre"), albums), {
                Baroque: [{title: 'Art of the Fugue', artist: 'Glenn Gould', genre: 'Baroque'}, {title: 'Goldberg Variations', artist: 'Daniel Barenboim', genre: 'Baroque'}],
                Rock: [{title: 'A Farewell to Kings', artist: 'Rush', genre: 'Rock'}, {title: 'Fly By Night', artist: 'Rush', genre: 'Rock'}],
                Jazz: [{title: 'Timeout', artist: 'Dave Brubeck Quartet', genre: 'Jazz'}, {title: 'Romance with the Unseen', artist: 'Don Byron', genre: 'Jazz'}],
                Romantic: [{title: 'New World Symphony', artist: 'Leonard Bernstein', genre: 'Romantic'}],
                Metal: [{title: 'Somewhere In Time', artist: 'Iron Maiden', genre: 'Metal'}],
                Modern: [{title: 'In Times of Desparation', artist: 'Danny Holt', genre: 'Modern'}],
                Broadway: [{title: 'Evita', artist: 'Various', genre: 'Broadway'}],
                Folk: [{title: 'Five Leaves Left', artist: 'Nick Drake', genre: 'Folk'}],
                Classical: [{title: 'The Magic Flute', artist: 'John Eliot Gardiner', genre: 'Classical'}]
            });
        });

        it('should group by a more complex function on the objects', function() {
            assert.deepEqual(groupBy(derivedGenre, albums), {
                Classical: [
                    {title: 'Art of the Fugue', artist: 'Glenn Gould', genre: 'Baroque'},
                    {title: 'Goldberg Variations', artist: 'Daniel Barenboim', genre: 'Baroque'},
                    {title: 'New World Symphony', artist: 'Leonard Bernstein', genre: 'Romantic'},
                    {title: 'In Times of Desparation', artist: 'Danny Holt', genre: 'Modern'},
                    {title: 'The Magic Flute', artist: 'John Eliot Gardiner', genre: 'Classical'}
                ],
                Rock: [
                    {title: 'A Farewell to Kings', artist: 'Rush', genre: 'Rock'},
                    {title: 'Fly By Night', artist: 'Rush', genre: 'Rock'},
                    {title: 'Somewhere In Time', artist: 'Iron Maiden', genre: 'Metal'}
                ],
                Jazz: [{title: 'Timeout', artist: 'Dave Brubeck Quartet', genre: 'Jazz'}, {title: 'Romance with the Unseen', artist: 'Don Byron', genre: 'Jazz'}],
                Broadway: [{title: 'Evita', artist: 'Various', genre: 'Broadway'}],
                Folk: [{title: 'Five Leaves Left', artist: 'Nick Drake', genre: 'Folk'}]
            });
        });

        it('should be automatically curried', function() {
            var grouper = groupBy(prop("genre"));
            assert.deepEqual(grouper(albums), {
                Baroque: [{title: 'Art of the Fugue', artist: 'Glenn Gould', genre: 'Baroque'}, {title: 'Goldberg Variations', artist: 'Daniel Barenboim', genre: 'Baroque'}],
                Rock: [{title: 'A Farewell to Kings', artist: 'Rush', genre: 'Rock'}, {title: 'Fly By Night', artist: 'Rush', genre: 'Rock'}],
                Jazz: [{title: 'Timeout', artist: 'Dave Brubeck Quartet', genre: 'Jazz'}, {title: 'Romance with the Unseen', artist: 'Don Byron', genre: 'Jazz'}],
                Romantic: [{title: 'New World Symphony', artist: 'Leonard Bernstein', genre: 'Romantic'}],
                Metal: [{title: 'Somewhere In Time', artist: 'Iron Maiden', genre: 'Metal'}],
                Modern: [{title: 'In Times of Desparation', artist: 'Danny Holt', genre: 'Modern'}],
                Broadway: [{title: 'Evita', artist: 'Various', genre: 'Broadway'}],
                Folk: [{title: 'Five Leaves Left', artist: 'Nick Drake', genre: 'Folk'}],
                Classical: [{title: 'The Magic Flute', artist: 'John Eliot Gardiner', genre: 'Classical'}]
            });
        });

    });
}());
