var currentGame = {}
var showForm = false;
var editingGame;

$(document).ready( function() {
  $('.game-item').on('click', function() {
    currentGame.id = this.dataset.id;
    currentGame.name = this.dataset.name

    $.ajax({
      url: '/games/' + currentGame.id + '/characters',
      method: 'GET',
      dataType: 'JSON'
    }).done( function(characters) {
      $('#games').text('Characters in ' + currentGame.name);
      var list = $('#characters');
      list.empty();
      characters.forEach( function(char) {
        var li = '<li data-character="' + char.id + '">' + char.name + '-' + char.power + '</li>';
        list.append(li);
      })
    })
  })

  function toggle() {
    showForm = !showForm;
    $('#game-form').remove();
    $('#games-list').toggle();
    
    if(showForm) {
      $('#toggle').text('Hide Button');

      $.ajax({
        url: '/game_form',
        method: 'GET',
        dataType: 'HTML',
        data: { id: editingGame }
      }).done( function(html) {
        $('#toggle').after(html);
      })
    } else {
      $('#toggle').text('Show Button');
    }
  }

  $('#toggle').on('click', function() {
    toggle();
  })

  $(document).on('submit', '#game-form form', function(e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    var url = '/games';
    var method = 'POST';
    if(editingGame) {
      url = '/games/' + editingGame;
      method = 'PUT';
    }

    $.ajax({
      url: url,
      method: method,
      dataType: 'JSON',
      data: data
    }).done( function(game) {
      toggle();
      // var g = '<li class="game-item" data-id="' + game.id + '" data-name="' + game.name + '">' + game.
      // name + '-' + game.description + '</li>';
      // $('#games-list').append(g);
      getGame(game.id);
    }).fail( function(err) {
      alert(err.responseJSON.errors);
    })
  })

  function getGame(id) {
    $.ajax({
      url: '/games/' + id,
      method: 'GET'
    }).done( function(game) {
      if(editingGame) {
        var li = $("[data-id='" + id + "'").parent();
        $(li).replaceWith(game);
        editingGame = null;
      } else {
        $('#games-list').append(game);
      }
    })
  }

  $(document).on('click', '#edit-game', function() {
    editingGame = $(this).siblings('.game-item').data().id;
    toggle();
  })

  $(document).on('click', '#delete-game', function() {
    var id = $(this).siblings('.game-item').data().id;

    $.ajax({
      url: '/games/' + id,
      method: 'DELETE',
      dataType: 'JSON'
    }).done( function() {
      var row = $("[data-id='" + id + "'");
      row.parent().remove('li');
    })
  })

});