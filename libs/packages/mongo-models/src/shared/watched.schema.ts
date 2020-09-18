export const watchedSchema: object = {
  watched: {
    type: {
      complete: {
        type: Boolean,
        default: false
      },
      progress: {
        type: Number,
        default: 0
      }
    }
  }
}
