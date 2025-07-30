// 通用API请求封装
export async function get(url, params = {}) {
  let query = '';
  if (Object.keys(params).length > 0) {
    query = '?' + new URLSearchParams(params).toString();
  }
  const res = await fetch(url + query, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '网络请求失败');
  }
  return await res.json();
}

export async function post(url, data = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '网络请求失败');
  }
  return await res.json();
} 