$(function() {

  var $body = $('body'),
      $layermask,
      groupList,// 同じモーダルグループのURL
      groupLength,// モーダルグループの要素数
      groupIndex = 0// モーダルグループの現在のindex
      ;

  // ===================モーダルウィンドウ=================== //
  var $modalWrap = $("<div></div>").addClass('modal-wrap'),
      $modalWindow = $('<div></div>').addClass('modal-window').appendTo($modalWrap),
      $modalContent = $('<div></div>').addClass('modal-content').appendTo($modalWindow),
      $modalBtnClose = $('<span>x</span>').addClass('btn-modal-close').appendTo($modalWindow)
      //$modalBtnClose = $('<span><i class="fa fa-times-circle"></i></span>').addClass('btn-modal-close').appendTo($modalWindow),
      //$modalListController = $('<ul></ul>').addClass('list-modal-controller').appendTo($modalWindow),
      //$modalBtnPrev = $('<li><a href="#" id="link-prev"><i class="fa fa-chevron-circle-left"></i></a></li>').addClass('btn-modal-prev').appendTo($modalListController),
      //$modalBtnNext = $('<li><a href="#" id="link-next"><i class="fa fa-chevron-circle-right"></i></a></li>').addClass('btn-modal-next').appendTo($modalListController),
      //$modalListPager = $('<ul></ul>').addClass('list-modal-pager').appendTo($modalWindow)
      ;
  $modalWrap.appendTo($body);

  /* ----------------------------------------------
     モーダルの高さの調整
  ---------------------------------------------- */
  var checkModalContentSize = function() {
    $('.modal-wrap').removeClass('is-over-windowheight');
    // コンテンツが現在のウィンドウの高さよりも高かった場合
    var contentH = $('.modal-content').height() + 30 + 60;
    if(contentH > $(window).height()) {
      $('.modal-wrap').addClass('is-over-windowheight');
    } else {
      $('.modal-wrap').removeClass('is-over-windowheight');
    }
  };

  /* ----------------------------------------------
     モーダルに入れる情報の取得
  ---------------------------------------------- */
  var getModalContent = function(context,e) {
    $('html').addClass('is-modal-loading');
    if(e) {
      e.preventDefault();
    }

    var target;
    if(context.tagName === 'A') {
      var target = $(context).attr('href');
    } else {
      target = context;
    }

    if(/^#/.test(target)) {
      var data = $(target).html();
      $modalContent.empty().append(data);
      showLayer($modalWrap);
      checkModalContentSize();
      $('html').removeClass('is-modal-loading');
    } else {

      $.ajax({
        url: target
      }).done(function(data) {
        $modalContent.empty().append(data);
        showLayer($modalWrap);
      }).always(function() {
        checkModalContentSize();
        $('html').removeClass('is-modal-loading');
      });
    }

  };

  // ===================レイヤー表示関数=================== //
  function showLayer(target){
    if(!target){
      target = $(this).attr("href");
    }
    $body.addClass('is-modal-open');
    // #layermask の追加
    if($('#layermask').length < 1) {
      $layermask = $("<div>").appendTo($body).attr({
        "id": "layermask"
      });
    } else {
      $layermask.show();
    }
    $(target).appendTo($body);
    $modalWrap.find($modalBtnClose).click(function(){
      closeLayer();
    });
    $modalWrap.on('click', function(event) {
      if (!$.contains($(this)[0], event.target)) {// モーダルコンテンツ自体をクリックした時は閉じない
        closeLayer();
      }
    });
  }

  // 閉じる
  function closeLayer(){
    $modalContent.animate({
      opacity: 0
    }, 150, function() {
      $modalContent.empty().removeAttr('style');
    });
    $layermask.fadeOut(150, function(){$(this).hide();});
    $body.removeClass('is-modal-open');
    $modalWindow.removeAttr('style');
  }


/* =============================================================================
   イベント登録
============================================================================= */
  // 一覧ページの「写真をもっと見る」ボタン
  $('.btn-modal').on('click', function(e){
    e.preventDefault();
    getModalContent(this,e);
    //createPager();
    if(groupLength <= 1) {
      $modalWrap.addClass('has-single-item');
    } else {
      $modalWrap.removeClass('has-single-item');
    }
  });
  // モーダル表示のprev/next
  $(document).on('click', '#link-prev', function(e){
    e.preventDefault();
    if(groupIndex <= 0) {
      groupIndex = groupLength-1;
    } else {
      groupIndex -= 1;
    }
    var targetUrl = groupList[groupIndex];
    getModalContent(targetUrl);
  });
  $(document).on('click', '#link-next', function(e){
    e.preventDefault();
    if(groupIndex >= groupLength-1) {
      groupIndex = 0;
    } else {
      groupIndex += 1;
    }
    var targetUrl = groupList[groupIndex];
    getModalContent(targetUrl);
  });

  // リサイズ
  var debounceCheckModal = _.debounce(function() {
    checkModalContentSize();
  }, 100);
  $(window).on('resize orientationchange', function() {
    debounceCheckModal();
  })

});
