'use client'

export default function ImageContainer(image) {
  const url = image.image
  return <img className="w-auto" src={url} alt="house" />
}
