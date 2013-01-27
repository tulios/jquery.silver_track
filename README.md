# SilverTrack
### A smart and very extensible sliding carousel

SilverTrack is a jQuery plugin designed to be extensible through other plugins. It has a small and solid core and comes with very useful plugins.
Refer to the [jQuery SilverTrack website](http://tulios.github.com/jquery.silver_track/) for examples.

#### Built-in plugins
  * [BulletNavigator](https://github.com/tulios/jquery.silver_track/blob/master/src/plugins/jquery.silver_track.bullet_navigator.js)
  * [Navigator](https://github.com/tulios/jquery.silver_track/blob/master/src/plugins/jquery.silver_track.navigator.js)
  * [RemoteContent](https://github.com/tulios/jquery.silver_track/blob/master/src/plugins/jquery.silver_track.remote_content.js)
  * [ResponsiveHubConnector](https://github.com/tulios/jquery.silver_track/blob/master/src/plugins/jquery.silver_track.responsive_hub_connector.js)

## Browser Compatibility

TODO

## Dependencies

* [jQuery](http://jquery.com) 1.7.2+
* [jQuery Easing 1.3](http://gsgd.co.uk/sandbox/jquery/easing/) for custom easing

PS: The ResponsiveHubConnector plugin requires the dependencies of [ResponsiveHub](https://github.com/globocom/responsive-hub)

## Usage

TODO

### Configuration Options

TODO: update!

<table>
  <tr>
    <th>Name</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>perPage</td>
    <td>4</td>
    <td>The amount of itens to display</td>
  </tr>
  <tr>
    <td>itemClass</td>
    <td>'item'</td>
    <td>The class name that will be used to find the item</td>
  </tr>
  <tr>
    <td>cover</td>
    <td>false</td>
    <td>When set to true, the plugin will consider the first page as a cover and will consider it as one item</td>
  </tr>
</table>

### Methods

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Parameters</th>
  </tr>
  <tr>
    <td>start</td>
    <td>Starts SilverTrack</td>
    <td></td>
  </tr>
  <tr>
    <td>goToPage</td>
    <td>Goes to a specific page when it exists</td>
    <td>page</td>
  </tr>
  <tr>
    <td>next</td>
    <td>Goes to the next page when it exists</td>
    <td></td>
  </tr>
  <tr>
    <td>prev</td>
    <td>Goes to the previous page when it exists</td>
    <td></td>
  </tr>
  <tr>
    <td>hasNext</td>
    <td>Returns true if next page exist</td>
    <td></td>
  </tr>
  <tr>
    <td>hasPrev</td>
    <td>Returns true if previous page exist</td>
    <td></td>
  </tr>
  <tr>
    <td>restart</td>
    <td>Restarts the position of the items, goes to the first page</td>
    <td></td>
  </tr>
  <tr>
    <td>install</td>
    <td>Installs a plugin. Check out the plugins section to see which callbacks are available</td>
    <td>plugin</td>
  </tr>
</table>
