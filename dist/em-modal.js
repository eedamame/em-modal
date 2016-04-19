/*
 *  EmModal - v0.1.0
 *  simple modal window
 *  http://dev.eedama.me/
 *
 *  Made by eedamame
 *  Under MIT License
 */

(function($){
  $.fn.emModal = function() {

    var
      $body = $('body'),
      $layermask;
    /* ----------------------------------------------
       create modal wrapper
    ---------------------------------------------- */
    var
      $modalWrap = $('<div></div>').addClass('modal-wrap'),
      $modalWindow = $('<div></div>').addClass('modal-window').appendTo($modalWrap),
      $modalContent = $('<div></div>').addClass('modal-content').appendTo($modalWindow),
      $modalBtnClose = $('<span>x</span>').addClass('btn-modal-close').appendTo($modalWindow)
      //$modalBtnClose = $('<span><i class="fa fa-times-circle"></i></span>').addClass('btn-modal-close').appendTo($modalWindow)
      ;
    $modalWrap.appendTo($body);

    var methods = {
      /* ----------------------------------------------
         モーダルの高さの調整
      ---------------------------------------------- */
      checkModalContentSize: function() {
        $('.modal-wrap').removeClass('is-over-windowheight');
        // コンテンツが現在のウィンドウの高さよりも高かった場合
        var contentH = $('.modal-content').height() + 30 + 60;
        if(contentH > $(window).height()) {
          $('.modal-wrap').addClass('is-over-windowheight');
        } else {
          $('.modal-wrap').removeClass('is-over-windowheight');
        }
      },

      /* ----------------------------------------------
         モーダルに入れる情報の取得
      ---------------------------------------------- */
      getModalContent: function(context,e) {
        $('html').addClass('is-modal-loading');
        if(e) {
          e.preventDefault();
        }

        var target;
        if(context.tagName === 'A') {
          target = $(context).attr('href');
        } else {
          target = context;
        }

        if(/^#/.test(target)) {
          var data = $(target).html();
          $modalContent.empty().append(data);
          methods.showLayer($modalWrap);
          methods.checkModalContentSize();
          $('html').removeClass('is-modal-loading');
        } else {

          $.ajax({
            url: target
          }).done(function(data) {
            $modalContent.empty().append(data);
            methods.showLayer($modalWrap);
          }).always(function() {
            methods.checkModalContentSize();
            $('html').removeClass('is-modal-loading');
          });
        }

      },

      // ===================レイヤー表示関数=================== //
      showLayer: function(target){
        if(!target){
          target = $(this).attr('href');
        }
        $body.addClass('is-modal-open');
        // #layermask の追加
        if($('#layermask').length < 1) {
          $layermask = $('<div>').appendTo($body).attr({
            'id': 'layermask'
          });
        } else {
          $layermask.show();
        }
        $(target).appendTo($body);
        $modalWrap.find($modalBtnClose).click(function(){
          methods.closeLayer();
        });
        $modalWrap.on('click', function(event) {
          if (!$.contains($(this)[0], event.target)) {// モーダルコンテンツ自体をクリックした時は閉じない
            methods.closeLayer();
          }
        });
      },

      // 閉じる
      closeLayer: function() {
        $modalContent.animate({
          opacity: 0
        }, 150, function() {
          $modalContent.empty().removeAttr('style');
        });
        $layermask.fadeOut(150, function(){$(this).hide();});
        $body.removeClass('is-modal-open');
        $modalWindow.removeAttr('style');
      }

    };


  /* =============================================================================
     イベント登録
  ============================================================================= */
    this.on('click', function(e){
      e.preventDefault();
      methods.getModalContent(this,e);
    });
    /* ----------------------------------------------
       リサイズ
    ---------------------------------------------- */
    var
      debounceCheckModal = _.debounce(function() {
        methods.checkModalContentSize();
      }, 100);
    $(window).on('resize orientationchange', function() {
      debounceCheckModal();
    });

    return this;
  };
})(jQuery);
