import java.util.*;
import java.lang.*;

class bet{
static void PrintArray(int n,int arr[])
{
	for(int i = 0; i < n; i++)
	{
		System.out.print(arr[i] + " ");
	}
}


static void NumberOfSegments(ArrayList<int[]> segments,	int[] points, int s, int p)
{
	ArrayList<int[]> pts = new ArrayList<>(), seg = new ArrayList<>();	

	for(int i = 0; i < p; i++)
	{
		pts.add(new int[]{points[i], i});
	}
	
	for(int i = 0; i < s; i++)
	{
		
		seg.add(new int[]{segments.get(i)[0], 1});
		
	
		seg.add(new int[]{segments.get(i)[1] + 1, -1});
	}
	

	Collections.sort(seg, (a, b) -> b[0] - a[0]);
	Collections.sort(pts, (a, b) -> a[0] - b[0]);
	
	int count = 0;
	int[] ans = new int[p];
	
	for(int i = 0; i < p; i++)
	{
		int x = pts.get(i)[0];
		
		while (seg.size() != 0 &&
			seg.get(seg.size() - 1)[0] <= x)
		{
			count += seg.get(seg.size() - 1)[1];
			seg.remove(seg.size() - 1);
		}
		ans[pts.get(i)[1]] = count;
	}
	

	PrintArray(p, ans);
}


public static void main(String[] args)
{
	
	
	ArrayList<int[]>seg = new ArrayList<>();
	

	seg.add(new int[]{1, 3});
	seg.add(new int[]{-10, 10});

	

	int[] point = {-100,100, 0};
	
	int s = seg.size();
	int p = point.length;
	
	NumberOfSegments(seg, point, s, p);
}
}