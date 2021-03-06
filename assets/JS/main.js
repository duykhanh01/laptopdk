$(document).ready(function () {
    // button back to top
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $('#to-top').fadeIn();
        } else {
            $('#to-top').fadeOut();
        }
    })

    $('#to-top').click(function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000)
    });

// -------------------------------- Cart --------------------------------
    // remove sản phẩm
    var removeCartItemButtons = $('.btn-remove');
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        $(button).click(function (e) {
            removeCartItem(e);
        });
    }

    function removeCartItem(event) {
        var buttonClicked = event.target;
        $(buttonClicked).parent().parent().remove();
        updateCartTotal();
        checkItem();
        animateRemoveCart();
    }

    // thay đổi số lượng sản phẩm
    var quantityInputs = $('.cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        $(input).change(quantityChanged);
    }

    function quantityChanged(event) {
        var input = event.target;
        //kiem tra xem co phai la so hoac be hon 1 k
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updateCartTotal();
    }

    // add sản phẩm vào cart
    var addToCartButtons = document.getElementsByClassName('btn-add');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
       button.addEventListener('click', function(e){
           addToCartClicked(e);
           animateAddCart(e);
       })
    }

    function addToCartClicked(event) {
        var button = event.target;
        var shopItem = button.parentElement.parentElement.parentElement;
        var title = shopItem.getElementsByClassName('item-name')[0].innerText;
        var price = shopItem.getElementsByClassName('price-pre')[0].innerText;
        var imgSrc = shopItem.getElementsByClassName('item-img-src')[0].src;
        
        // var shopItem = $(button).parent().parent().parent().parent();
        // var title = $('abc, .info-name').text();
        // var price = $('shopItem, .info-price').text();
        //var imgSrc = $('shopItem, .img-main a .img-src').attr('src');
        addItemToCart(title, price, imgSrc);
        updateCartTotal();
        checkItem();
        alert('Đã thêm sản phẩm vào giỏ hàng!');
        console.log(shopItem)
    }

    function addItemToCart(title, price, imgSrc) {
        var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        var cartItemsNames = document.getElementsByClassName('cart-item-title');
        // for (var i = 0; i < cartItemsNames.length; i++) {
        //     if(cartItemsNames[i].innerHTML == title){
        //         alert('Sản phẩm này đã được thêm vào gỏ hàng!');
        //         return;
        //     };
        // }
        var cartRowContens = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imgSrc}">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger btn-remove" type="button">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContens;
        cartItems.append(cartRow);
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);

    }

    // udate tổng tiền
    function updateCartTotal() {
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        var total = 0
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var priceElement = cartRow.getElementsByClassName('cart-price')[0]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var price = parseFloat(priceElement.innerHTML.replace('Đ', '').split('.').join('')); // remove 'Đ' và dots
            var quantity = quantityElement.value;
            total = total + (price * quantity);
        }
        $('.cart-total-price').first().text(numberWithCommas(total) + 'Đ');
    }

    // hàm thêm các dấu chấm vào giá
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        // Biểu thức chính quy
        // \B giữ cho regax k đặt dấu chấm ở đầu chuỗi
        // \d{3} kí tự số xuất hiện 3 lần
        // ?=(\d{3} tìm bất kỳ điểm nào trong chuỗi có bội số 3 chữ số liên tiếp sau nó,
        // "+" Cho phép kí tự trước nó lặp lại 1 lần hoặc nhiều lần
        // ?!\d một khẳng định phủ định để đảm bảo rằng điểm đó chỉ có đúng bội số của 3 chữ số. Biểu thức thay thế đặt dấu chấm ở đó. 
    }

    // click mua hàng
    $('.btn-purchase').click(purchaseClicked);

    function purchaseClicked() {
        alert('Đặt hàng thành công');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        $('.cart-form').parent('div').find('input, textarea').val('');
        //$('.cart-form').parent('div').find('textarea').val('');
        checkItem();
        updateCartTotal();
    }

    // kiểm tra xem có sản phầm nào không
    function checkItem() {
        var cartItems = $('.cart-items');
        var noCart = $('.no-item');
        var cart = $('.have-items')
        if (cartItems.children().length > 0) {
            $(noCart).removeClass('cart-active');
            $(cart).addClass('cart-active');
        } else {
            var cartNumber = document.getElementsByClassName('cart-number')[0];
            $(noCart).addClass('cart-active');
            $(cart).removeClass('cart-active');
            cartNumber.innerHTML = "0";
        }
    }
    checkItem();

    // xử lý nút next và prev ở cart
    $('.btn-cart-next').click(function () {
        $('.nav-link.active').parent().next('li').find('button').trigger('click');
    });
    $('.btn-cart-prev').click(function () {
        $('.nav-link.active').parent().prev('li').find('button').trigger('click');
    });

    // ---------- xử lý ẩn hiện modal ----------------

    var modalBtn = $('.header-cart');
    var modal = $('#modal');
    var modal1 = document.getElementsByClassName('modal')
    var btnClose = $('.btn-close');

    $(modalBtn).click(function () {
        $(modal).addClass(' modal-active');
        $('body').css('overflow', 'hidden')
    })

    $(btnClose).click(function () {
        $(modal).removeClass('modal-active');
        $('body').css('overflow', 'auto')
    })

    $(window).click(function (e) {
        outsideClick(e);
    })

    function outsideClick(e) {
        var target = $(e.target);
        if (target.is('#modal')) {
            $(modal).removeClass('modal-active');
            $('body').css('overflow', 'auto')
        }
    }

    // ------------- Xử lý hiệu ứng khi thêm sản phẩm -----------------
    var cartNumber = document.getElementsByClassName('cart-number')[0];

    function animateAddCart(e) {
        cartNumber.innerHTML++;
    }

    function animateRemoveCart(e) {
        var number = cartNumber.innerHTML;
        if (number <= 0) {
            cartNumber.innerHTML = "0";
        } else {
            cartNumber.innerHTML--;
        }
    }

    // Thêm đường dẫn vào các link để hoàn thiện bài tập
    $('.nav-menu a').attr('href','laptop-gaming.html')
    $('.sub-nav-list li a').attr('href','laptop-gaming.html');
    $('.title-content a').attr('href','laptop-gaming.html')
    $('.product-item .item-info .item-name').attr('href','product.html')
    $('.product-item .item-img a').attr('href','product.html')
});