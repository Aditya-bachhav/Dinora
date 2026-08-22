export const money=n=>`₹${Number(n||0).toFixed(2)}`; export const tablePath=(token,path='')=>`/t/${token}${path}`;
