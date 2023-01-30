/*

 * CollapseNav.js - v1.1
 * jQuery Responsive Navigation
 * MIT License
 * by Petko Yovchevski

 Website: https://www.plumtex.com
 Docs: http://pyovchevski.github.io/collapse-nav
 Repo: https://github.com/PYovchevski/collapse-nav
 Issues: https://github.com/PYovchevski/collapse-nav/issues

 */

function initCollapseNav(selector, config, callback) {
    const navigation = selector;

    navigation.classList.remove('collapseNav-not-initialized');
    navigation.classList.add('collapseNav-initialized')

    const defaults = {
        debug: false,
        responsive: 1, //Automatically count the possible buttons in the navigation
        number_of_buttons: 4, //Allowable number of buttons in the navigation. Works only if 'responsive' = 0
        more_text: 'More', //The text on the Drop Down Button
        mobile_break: 992, //With this resolution and higher the script will be init
        li_class: 'dropdown',
        li_attrs: 'data-custom-attr="attr value"',
        li_a_class: 'dropdown-toggle',
        li_ul_class: 'dropdown-menu',
        caret: '<span class="caret"></span>', //Element append immediately after the More text,
        bootstrap_version: false
    }

    const configuration = Object.assign(defaults, config);

    let ul_width = navigation.offsetWidth;
    let li_width = 0;
    let possible_buttons = 0;
    let li_count = 0;

    if (configuration.debug) {
        console.log('ul: ' + ul_width);
    }

    /*---------------------------------------
     --- Check base buttons to navigation  ---
     --------------------------------------*/
    // iterate over all child nodes
    Array.from(navigation.children).forEach(li => {
        li_count = li_count + 1;
        li_width = li_width + li.offsetWidth;

        if (ul_width >= li_width) {
            possible_buttons = possible_buttons + 1;
        }
    });

    // The navigation does not need a More menu, then stop the script
    if (configuration.debug) {
        console.log('li_count: ' + li_count);
        console.log('possible_buttons: ' + possible_buttons);
    }
    if (li_count <= possible_buttons) {
        return;
    }

    if (configuration.debug) {
        console.log('Possible buttons: ' + possible_buttons);
    }

    /*-------------------------------------------
     --- Check the more buttons to navigation ---
     ------------------------------------------*/
    li_width = 0;
    possible_buttons = 0;
    li_count = 0;

    //The More Button Width

    const newChild = navigation.firstElementChild.cloneNode(true);
    navigation.appendChild(newChild);

    navigation.lastElementChild.querySelector('a').innerHTML = configuration.more_text + ' ' + configuration.caret;
    navigation.lastElementChild.querySelector('a').style.visibility = 'hidden';

    const the_more_button_width = navigation.lastElementChild;

    li_count = li_count + 1;
    li_width = li_width + the_more_button_width.offsetWidth;
    if (configuration.debug) {
        console.log(li_count + ' li More: ' + li_width);
    }
    the_more_button_width.remove();

    // iterate over all child nodes
    Array.from(navigation.children).forEach(li => {
        li_count = li_count + 1;
        li_width = li_width + li.offsetWidth;

        if (configuration.debug) {
            console.log(li_count + ' li ' + $(this).text() + ': ' + li_width);
        }

        if (ul_width >= li_width) {
            possible_buttons = possible_buttons + 1;
        }
    });

    if (configuration.debug) {
        console.log('Possible buttons: ' + (possible_buttons + 1) + ' + More button');
    }

    /*------------------
     --- Some checks ---
     -----------------*/
    let number_of_buttons;

    if (configuration.responsive == 1) {
        number_of_buttons = possible_buttons;
    } else {
        number_of_buttons = configuration.number_of_buttons;
        if (!number_of_buttons) {
            number_of_buttons = 4;
        }
    }

    if (configuration.debug) {
        console.log('Number of buttons: ' + number_of_buttons);
    }

    if (window.innerWidth < configuration.mobile_break) {
        return;
    }

    /*----------------------------------------
     --- Convert the navigation to the new ---
     ----------------------------------------*/
    let btn_n = 0;
    let ul = '<ul class="' + configuration.li_ul_class + '">'
    // iterate over all child nodes
    Array.from(navigation.children).forEach(li => {
        btn_n = btn_n + 1;

        if (btn_n > number_of_buttons) {
            if (configuration.debug) {
                console.log(btn_n + ' > ' + number_of_buttons);
            }

            ul += li.outerHTML;
        }
    });

    ul += '</ul>';

    number_of_buttons = number_of_buttons - 1;

    $(navigation).children("li:gt(" + number_of_buttons + ")").remove();

    const menuExpand = document.createElement('div');
    if (configuration.bootstrap_version) {
        if (configuration.bootstrap_version > 3) {
            menuExpand.innerHTML = '<li class="' + configuration.li_class + '" ' + configuration.li_attrs + '><a href="javascript:;" class="' + configuration.li_a_class + '" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + configuration.more_text + configuration.caret + '</a>' + ul + '</li>';
        } else {
            menuExpand.innerHTML = '<li class="' + configuration.li_class + '" ' + configuration.li_attrs + '><a href="javascript:;" class="' + configuration.li_a_class + '" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + configuration.more_text + configuration.caret + '</a>' + ul + '</li>';
        }
    } else {
        menuExpand.innerHTML = '<li class="' + configuration.li_class + '" ' + configuration.li_attrs + '><a href="javascript:;" class="' + configuration.li_a_class + '" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + configuration.more_text + configuration.caret + '</a>' + ul + '</li>';
    }

    navigation.appendChild(menuExpand.firstChild);

    if (callback) {
        callback();
    }
}

function collapseNav(selector, config, callback = false) {
    const configuration = config;
    const navigation = selector;
    const original_navigation = {'outer': selector.outerHTML, 'inner': selector.innerHTML};

    navigation.classList.add('collapseNav-not-initialized');

    $(window).on('load resize collapseNavReInit', function () {
        if (window.innerWidth >= configuration.mobile_break) {
            $(navigation).html(original_navigation.inner);
        }
        initCollapseNav(navigation, configuration, callback);
    });

    window.addEventListener("orientationchange", function () {
        if (window.innerWidth >= configuration.mobile_break) {
            $(navigation).html(original_navigation.inner);
        }
        initCollapseNav(navigation, configuration, callback);
    }, false);

    initCollapseNav(navigation, configuration, callback);
}

$.fn.collapseNav = function (config, callback = false) {
    config = config || {}

    const defaults = {
        responsive: 1, //Automatically count the possible buttons in the navigation
        number_of_buttons: 4, //Allowable number of buttons in the navigation. Works only if 'responsive' = 0
        more_text: 'More', //The text on the Drop Down Button
        mobile_break: 992, //With this resolution and higher the script will be init
        li_class: 'dropdown',
        li_a_class: 'dropdown-toggle',
        li_ul_class: 'dropdown-menu',
        caret: '<span class="caret"></span>' //Element append immediately after the More text
    }

    const settings = $.extend({}, defaults, config)

    return this.each(function () {
        setTimeout(function (scope) {
            collapseNav(scope, settings, callback);
        }, 700, this);
    })
}