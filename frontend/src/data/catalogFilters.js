const rawSizeData = `
40 x 80
16.5 x 16.5
16.3 x 51.7
90 x 90
90 X 180
7.5 x 30
120 x 278
50 x 120
10 x 30
30 x 60
100 x 100
80 x 160
45 x 90
75 X 150
60 x 60
30 x 30
80 x 80
11 x 54
100 x 200
120 x 120
20 x 20
30 x 120
6 x 24
120 x 280
60 x 120
15 x 90
20 x 120
`

const sizeOptions = rawSizeData
  .split('\n')
  .map(item => item.trim())
  .filter(Boolean)
  .map(label => ({
    id: label.toLowerCase(),
    name: label
  }))

const rawFeaturedCategories = `
Gạch gốm ốp lát
Gạch cắt
Van vòi Lavabo đặt bàn 1 lỗ
Mặt nạ bộ trộn nước âm tường
Linh kiện
Lavabo đặt bàn
Thanh treo khăn
Van vòi lavabo gắn tường - phần lắp ngoài
Gạch men ốp tường
Giá treo giấy vệ sinh
Bát sen gắn tường
Các sản phẩm khác
Van vòi bồn tắm đặt sàn
Vòi xịt vệ sinh
Sen tay
Thanh trượt, gác sen, sen tay, dây, cục cấp nước
Bồn tắm thường - tự đứng
Móc treo
Van vòi Lavabo đặt bàn 3 lỗ
Bát sen gắn trần
Sen tắm gắn trần - bộ phận lắp ngoài
Bình đựng xà phòng
Lọ / cốc
Nắp bồn cầu thông thường
Van vòi bồn tắm gắn thành bồn
Ván sợi bằng gỗ
Nút nhấn két nước âm tường
Sen tắm hông
Phụ kiện vòi nước lavabo
Sen tay, dây sen, gác sen, cục cấp nước
Cục cấp nước cho sen tay
Khay đựng xà phòng
Thân bồn cầu treo tường
Gương
Vòng treo khăn
Bộ xả nhấn - lavabo có lổ xả tràn
Van vòi Lavabo gắn tường
Nẹp
Giá treo áo
Lavabo âm bàn
`

const tileFeaturedNames = ['Gạch gốm ốp lát', 'Gạch cắt', 'Gạch men ốp tường']
const featuredCategoryNames = rawFeaturedCategories
  .split('\n')
  .map(item => item.trim())
  .filter(name => name && name.toLowerCase() !== 'null')

const nonTileFeaturedNames = featuredCategoryNames.filter(name => !tileFeaturedNames.includes(name))

const featuredCategoriesMap = {
  gach: tileFeaturedNames,
  'gạch': tileFeaturedNames,
  'gạch ốp lát': tileFeaturedNames,
  tbvs: nonTileFeaturedNames,
  'thiet bi ve sinh': nonTileFeaturedNames,
  'thiết bị vệ sinh': nonTileFeaturedNames,
  'san go': nonTileFeaturedNames,
  'ván sàn': nonTileFeaturedNames
}

const normalizeKey = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

export const getSizeOptions = () => sizeOptions.map(size => ({ ...size }))

export const getFeaturedCategories = (productType) => {
  const key = normalizeKey(productType)
  const list = featuredCategoriesMap[key] || []
  return list.map(name => ({ id: name, name }))
}

export const FEATURED_CATEGORY_LABELS = featuredCategoriesMap

