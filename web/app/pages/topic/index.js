import ATV from 'atvjs'
import template from './template.hbs'

import API from 'lib/rozhlas.js'

const TopicPage = ATV.Page.create({
  name: 'topic',
  template: template,
  ready (options, resolve, reject) {
    let getTopic = ATV.Ajax.get(API.url.topic(options.id), {})

    Promise
      .all([getTopic])
      .then((xhrs) => {
        var data = xhrs[0].response.data
        var obj = {}

        obj.attributes = data.attributes

        for (var widget of data.attributes.widgets) {
          if (widget.type == 'carousel') {
            obj.carousel = []
            for (var i of widget.attributes.items) {
              if (i.itemType == 'audio')
                obj.carousel.push(i)
            }
          }
          else if (widget.type == 'shows_list') {
            obj.shows = []
            for (var i of widget.attributes.entities) {
              if (i.type == 'show')
                obj.shows.push(i)
            }
          }
          else if (widget.type == 'episodes_list') {
            obj.episodes = []
            for (var ep of widget.attributes.entities) {
              if (ep.type == 'episode') {
                var e = ep
                e.attributes.length = API.episode_time(ep.attributes.since, ep.attributes.till)
                obj.episodes.push(e)
              }
            }
          }
        }

        resolve(obj)
      }, (xhr) => {
        // error
        reject()
      })
  }
})

export default TopicPage
