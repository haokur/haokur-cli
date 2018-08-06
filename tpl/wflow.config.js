const fs = require('fs')
const path = require('path')
const sourcePath = path.join(__dirname, 'src')

const WflowConf = {
  g: {
    getWillCreateDir(order, createName) {
      if (order === 'page') {
        return `${sourcePath}/${order}s/${createName}`
      }
      else if (order === 'component') {
        return `${sourcePath}/${order}s`
      }
    },
    // getOrderTemplate(order, type, createName) {
    //   return new Promise((resolve, reject) => {
    //     let _sourcePath = path.join(__dirname, WflowConf.g.orders[order].source[type]);
    //     let _tplStr = fs.readFileSync(_sourcePath)
    //     resolve(_tplStr.toString().replace(/{{createName}}/g, createName))
    //   })
    // },
    orders: {
      'page': {
        'source': {
          'page': 'tpl/page.tpl.vue',
          'style': 'tpl/style.tpl.scss'
        },
        'target': {
          'page': '{{createName}}.vue',
          'style': '{{createName}}.scss'
        }
      },
      'component': {
        'source': {
          'component': 'tpl/cpt.tpl.vue',
        },
        'target': {
          'component': 'src/{{order}}/{{createName}}.vue',
        }
      }
    }
  }
}

module.exports = WflowConf