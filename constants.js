export const templates = [
  {
    name:"webpack-template",
    value:"yingside/webpack-template",
    desc:"基于webpack5自定义初始化Vue3项目模板"
  },
  {
    name:"vue-admin-box",
    value:"cmdparkour/vue-admin-box",
    desc:"基于vue3的admin-box模板"
  },
  {
    name:"vite-template",
    value:"yingside/vite-template",
    desc:"基于vite3自定义初始化Vue3项目模板+前端工具链模板"
  },
  {
    name:"vite-templates",
    value:"wuhujiang/vue3-template",
    desc:"基于vite3自定义初始化Vue3项目模板"
  }
]

export const messages = [
  {
    message:'请输入项目名称',
    name:'name',
    validate: (value) => {
      if(value.match(/[\u4E00-\u9FFF`~!@#$%^&*()::<>?]/g)){
        return '项目关键词不能包含特殊字符'
      }
      return true
    }
  },
  {
    message:'请输入项目关键词(,分割)',
    name:'keyword',
  },
  {
    message:'请输入项目描述',
    name:'description'
  },
  {
    message:'请输入项目作者',
    name:'author'
  },  
]