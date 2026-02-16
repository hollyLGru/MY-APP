'use client'

export default function ImageContainer(image) {
  console.log(image)
  const url = image.image ?? image
  return <img className="w-auto" src={url} alt="house" />
}
