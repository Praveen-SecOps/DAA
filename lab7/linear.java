import java.util.*;
class linear{

	static int recSearch(int arr[], int l, int r, int x)
	{
		if (r < l)
			return -1;
		if (arr[l] == x)
			return l;
		if (arr[r] == x)
			return r;
		return recSearch(arr, l+1, r-1, x);
	}

	public static void main(String[] args)
	{
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the array size: ");
        int n=sc.nextInt();
	    int arr[] = new int[n];
        System.out.println("Enter the array elements: ");
        for(int i=0;i<n;i++){
            arr[i]=sc.nextInt();
        }
        System.out.println("Enter the KEY number that needs to be found: ");
		int x = sc.nextInt();
		int index = recSearch(arr, 0, arr.length-1, x);
		if (index != -1)
		System.out.println("Element " + x + " is present at index " +index);
		else
			System.out.println("Element " + x + " is not present");
		}
}
