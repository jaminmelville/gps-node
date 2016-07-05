var theme = getCookie('theme')
var colors = {
  'green': '#709C00',
  'pink': '#ff50d3',
  'blue': '#0000ff'
}
var PRIMARY_COLOR = colors[theme] ? colors[theme] : colors['green']
