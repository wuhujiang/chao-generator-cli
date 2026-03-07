// Inquirer v13 使用单独的导入
import select from '@inquirer/select';
import confirm from '@inquirer/confirm';

/**
 * 
 * @param { string } message 
 * @returns 
 */
export const inquirerConfirm = async (message) => {
  const answer = await confirm({
    message: message,
  });
  return { confirm: answer };
}

export const inquirerChoose = async (message, choices) => {
  // 确保 choices 是一个数组
  if (!Array.isArray(choices)) {
    console.error('Error: choices must be an array');
    return { choose: '' };
  }
  
  // 为 Inquirer v13 格式化 choices
  const formattedChoices = choices.map(item => ({
    name: item.name,
    value: item.value,
    description: item.desc
  }));
  
  const answer = await select({
    message: message,
    choices: formattedChoices
  });
  
  return { choose: answer };
}