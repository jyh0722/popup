$.fn.yhPopup = function (option) {
    $(this).each(function () {
        // $(this): 각각의 팝업
        // $(this)가 popup이 아니거나 없을때.
        if(!$(this).hasClass("popup-container")) return false;
      
        yhPopupInner($(this));
    });
  
    function yhPopupInner($el) { 
        // setting = defaultOption + option
        var defaultOption = {
                show: false,
                keyboard: true,
                backdrop: true,
                $el: $el,
                $focus: $(":focus")
             },
            setting = makeSetting(defaultOption),
            // focusList = open popup focus list
            focusList = setting.$el.find("button, input, a, textarea");
     
        function init() {
            // add data yhPopupConfig
            setting.$el.data({
                yhPopupConfig: setting
            });

            // setting.show
            if (setting.show) {
                popupOpen();
            } else {
                popupClose();
            }

            // setting.backdrop : Dim Click
          //팝업 내부가 아닌경우 클릭 시 닫힘
            if (setting.backdrop) {
                setting.$el.on("click", function (e) {
                  if (!setting.$el.find(".pop-wrap").find("*").hasClass(e.target.className)){
                    if(!setting.$el.find(".pop-wrap").hasClass(e.target.className)) {
                          e.preventDefault();
                          popupClose();
                    }
                    }
                });
            } else {
                setting.$el.off("click");
            }

            // setting.keyboard : ESC
            if (setting.keyboard) {
               
              setting.$el.on("keydown", function (e) {
                    if (e.keyCode == 27) {
                        popupClose();
                    }
                });
            }

            // popup 내부 포커스 이동
            focusList.last().on("keydown", function (e) {
                if (e.keyCode == 9 && !e.shiftKey) {
                    e.preventDefault();
                    focusList.first().focus();
                }
            })
            focusList.first().on("keydown", function (e) {
                if (e.keyCode == 9 && e.shiftKey) {
                    e.preventDefault();
                    focusList.last().focus();
                }
            })

            setting.$el.find(".btn-close").on("click", function () {
                popupClose();
            });
        }

        //default, html, js option setting
        function makeSetting(defaultOption) {
            var settingObj,
                optionData = {},
                optionScript = option;

            // html data
            //data 값 한번에 가져오기, 기존 디폴트 옵션 비교 후 최신 data로 수정
          if(defaultOption.$el.data("show")){
            optionData.show = true;
          }else{
            optionData.show = false;
          }
          if(defaultOption.$el.data("keyboard")){
            optionData.keyboard = true;
          }else{
            optionData.keyboard = false;
          }
          if(defaultOption.$el.data("backdrop")){
            optionData.backdrop = true;
          }else{
            optionData.backdrop = false
          }
          console.log(optionData)
          

            // js option
            if (option === undefined || option === "show") {
                optionScript = {
                    show: true
                };
            }else if (option === "hide") {
                optionScript = {
                    show: false
                };
            } else if (option === "toggle") {
                optionScript = {
                    show: !defaultOption.$el.hasClass("active")
                };
            }

            settingObj = $.extend({}, defaultOption, optionData, optionScript);
            return settingObj;
        }

        function popupOpen() {
            // 미리 세팅 값을 바꾸고
            setting.show = true;
            // 화면을그리고 
          //CSS addClass 사용성
            $("body").addClass("popup-open");
            setting.$el.addClass("active");
            // focus 이벤트 지연
            // https://vnthf.github.io/blog/jquery-focusout과click-event충돌/
            setTimeout(function () {
                focusList.first().focus();
            }, 0);
            // 바꾼 최종 세팅을 다시 넣고
            setting.$el.data("yhPopupConfig", setting);
        }

        function popupClose() {
            // 미리 세팅 값을 바꾸고
            setting.show = false;
            // 화면을그리고 
            $("body").removeClass("popup-open");
            setting.$el.removeClass("active");
            // 클릭했던 popup link로 focus
            setting.$focus.focus();
            // 바꾼 최종 세팅을 다시 넣고
            setting.$el.data("yhPopupConfig", setting);
        }

        init();
    }
};
// (function() {
// })();
// (function() {
// }());
// $(window).onload();
//프로토타입

//$(document).ready(function(){ }); 와 동일한 의미
$(function () {
  
    $("a[data-toggle='popup'], button[data-toggle='popup']").on("click", function (e) {
        e.preventDefault();
        var dataTarget = $(this).attr("data-target");
        
          $(dataTarget).yhPopup("toggle");
        
    });
});

// todo: 옵션 적용
// $(".popup-container").yhPopup({
//   show: true,
//   keyboard: false,
//   backdrop: true
// });