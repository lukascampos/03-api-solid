import 'dotenv/config'

class Env {
  NODE_ENV?: string
  PORT?: number | string

  constructor() {
    if (this.NODE_ENV === undefined) {
      this.NODE_ENV = 'dev'
    }

    if (this.PORT === undefined) {
      this.PORT = 3333
    }

    if (typeof this.PORT === 'string') {
      this.PORT = parseInt(this.PORT)
    }
  }
}

const _env = new Env()
_env.PORT = process.env.PORT

export { _env }
