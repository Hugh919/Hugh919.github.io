// src/lib/imageai.ts
// 这个文件包含与AI绘画API通信的函数

// 定义图像生成请求参数
export interface ImageGenerationRequest {
  prompt: string;
  n?: number;
  size?: string;
  style?: string;
}

// 定义图像生成响应
export interface ImageGenerationResponse {
  created: number;
  data: {
    url: string;
    prompt: string;
  }[];
}

// 模拟AI绘画API调用
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  // 在实际应用中，这里会调用真实的AI绘画API
  // 现在我们使用模拟响应
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 使用prompt的内容生成一个伪随机数，确保相同的prompt总是生成相同的图像
  const seed = request.prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 使用不同的占位图服务生成图像
  const width = 512;
  const height = 512;
  const imageId = (seed % 1000) + 1; // 1-1000之间的ID
  
  // 根据风格选择不同的图像生成方式
  let imageUrl = '';
  const style = request.style || 'realistic';
  
  if (style === 'abstract') {
    imageUrl = `https://picsum.photos/seed/${imageId + 1000}/${width}/${height}`;
  } else if (style === 'cartoon') {
    imageUrl = `https://picsum.photos/seed/${imageId + 2000}/${width}/${height}`;
  } else {
    imageUrl = `https://picsum.photos/seed/${imageId}/${width}/${height}`;
  }
  
  return {
    created: Date.now(),
    data: Array(request.n || 1).fill(null).map((_, i) => ({
      url: imageUrl,
      prompt: request.prompt
    }))
  };
}

// 获取可用的图像生成风格
export function getAvailableStyles(): { id: string; name: string }[] {
  return [
    { id: 'realistic', name: '写实风格' },
    { id: 'abstract', name: '抽象风格' },
    { id: 'cartoon', name: '卡通风格' }
  ];
}

// 获取可用的图像尺寸
export function getAvailableSizes(): { id: string; name: string }[] {
  return [
    { id: '256x256', name: '小图 (256x256)' },
    { id: '512x512', name: '中图 (512x512)' },
    { id: '1024x1024', name: '大图 (1024x1024)' }
  ];
}
