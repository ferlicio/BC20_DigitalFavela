export function convertSnaps<T>(results: any) {

  return <T[]>results.docs.map((snap: { id: any; data: () => any }) => {
    return {
      id: snap.id,
      ...<any>snap.data()
    }
  })
}
export function convertSnapsW<T>(results: any) {

  return <T[]>results.map((snap: { data: () => any }) => {
    return {
      ...<any>snap
    }
  })
}
