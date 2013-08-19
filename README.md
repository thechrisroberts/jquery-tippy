# Tippy for jQuery

A tooltip plugin for jQuery making it easy to create highly customizable, flexible and powerful tooltips for your website.

Tippy is the creation of [Chris Roberts](http://croberts.me/)

Be sure to visit the [Tippy page](http://tippy.croberts.me/)

* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)

## Installation

1. Clone or [download](https://github.com/sergeche/emmet-sublime/archive/master.zip)
2. Copy jquery.tippy.js and jquery.tippy.css into your website folder
3. Load both files into your site header
4. Load jQuery into your header. [Google Hosted Libraries](https://developers.google.com/speed/libraries/devguide) is an excellent place.
5. If you will want to make tooltips draggable, load jQuery UI, also from [Google Hosted Libraries](https://developers.google.com/speed/libraries/devguide).

## Usage

Be sure to visit the [Tippy page](http://tippy.croberts.me/) for demos and more details.

1. Include jquery.tippy.js
2. Include jquery.tippy.css
3. Start Tippy with $('.tippy').tippy(); use any selector, but .tippy is recommended since it is predefined in the stylesheet.
4. In your website, create a tooltip via &lt;span class="tippy" data-title="My tooltip">This is a nifty tooltip&lt;/span>
5. Enjoy!

## Options

Tippy includes quite a few options all of which can be set either globally or per-tooltip.

Set globally, the options are passed to tippy in an object:

* $('.tippy').tippy({ autoclose: false, showheader: false });

Set per-tooltip, the option goes into the tooltip tag as a data attribute:

* &lt;span class="tippy" data-title="Example tooltip" data-autoclose="false" data-showheader="false">Another nifty tooltip.&lt;/span>

### Comprehensive list of options
If there is a default value, it is shown in parenthesis. If an option has specific values available, they are listed out with the default showing first.

* multitip (false/true): If true, multiple tooltips can be displayed at once.
* autoshow (false/true): If true, the tooltip or tooltips will automatically show when the page loads.
* showtitle (false/true): Whether or not to use the title attribute in links. Good for accessibility, bad for visibility.
* hoverpopup (true/false): If true, tooltip displays when hovering over the link. If false, tooltip displays when the link is clicked.
* showdelay (100): Adds a slight delay before displaying the tooltip to prevent popping up tooltips when the mouse moves across the page.
* showspeed (200): How long it takes in ms for the tooltip to fade in.
* hidespeed (200): How long it takes in ms for the tooltip to fade out.
* autoclose (true/false): Whether or not the tooltip should automatically close after a delay.
* hidedelay (1000): How long it takes in ms before the tooltip begins to auto fade out.
* container: By default, the tooltip is placed in the DOM right where you set it but if you want to use Tippy for specific positioning, you can change its parent element by specifying a CSS selector here.
* position ('link/mouse/css position value'): Specifies where the tooltip should be positioned. If set to link or mouse, the x and y values are automatically determined.
* top: Useful when position set to fixed, absolute, or relative.
* bottom: Useful when position set to fixed, absolute, or relative.
* left: Useful when position set to fixed, absolute, or relative.
* right: Useful when position set to fixed, absolute, or relative.
* offsetx (10): Set a default horizontal offset for the tooltip position. Useful when position set to link or mouse.
* offsety (10): Set a default vertical offset for the tooltip position. Useful when position set to link or mouse.
* width: Specify a width for the tooltip. The default is set in jquery.tippy.css.
* height: Specify a height for the tooltip. The default is set in jquery.tippy.css.
* draggable (false/true): Allow visitors to drag the tooltip around. Useful when autoclose is false. Requires jQuery UI.
* dragheader (true/false): If draging is enabled and this is set to true, tooltip will only be draggable from the header bar. If false, visitors can drag from any part of the tooltip.
* anchor: Optional CSS selector specifying the link element that will trigger Tippy.
* title: Sets the text shown on the link and in the header.
* swaptitle: Alternate title to use when the visitor hovers over the link.
* img: Tippy can be used with images rather than text; set img to the url of an image to display Tippy on an image.
* swapimg: Like swaptitle, swapimg switches to an alternate image when a visitor hovers over the link.
* href: If href is set, the Tippy link will point to this url.
* target: Specifies the link target for the Tippy link.
* showheader (true/false): Whether or not the tooltip should show a header.
* headertitle: By default, the header is set to the tooltip title. With headertitle, you can set specific text for the title.
* headerhref: If headerhref is set, the tooltip header text will be a link pointing to this url.
* showclose (true/false): Whether or not the tooltip have a close link. Usefor for mobile devices or when autoclose is false.
* closetext ('close'): The text to display for the close link.
* calcpos ('parent/document'): Calculate the tooltip link position relative to its parent or to the whole document.