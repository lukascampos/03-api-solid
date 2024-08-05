export type UserProps = {
  name: string
  email: string
  password: string
}

export class UserEntity {
  props: UserProps

  constructor(public readonly userProps: UserProps) {
    this.props = userProps
  }

  get getName() {
    return this.props.name
  }

  get getEmail() {
    return this.props.email
  }

  get getPassword() {
    return this.props.password
  }
}
